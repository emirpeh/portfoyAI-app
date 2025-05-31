<script setup lang="ts">
import L from 'leaflet'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import 'leaflet/dist/leaflet.css'

const props = defineProps<{
  loadingLocation: [number, number]
  unloadingLocation: [number, number]
  truckLocations?: { lastLocation: string }[]
}>()

const { t } = useI18n()

const mapContainer = ref<HTMLElement>()
const map = ref<L.Map | null>(null)
const routeLines = ref<L.Polyline[]>([])
const markers = ref<L.Marker[]>([])

// Function to get coordinates for a location name
async function getCoordinates(locationName: string): Promise<[number, number] | null> {
  if (!locationName || locationName.trim() === '') {
    console.warn('Empty location name provided to getCoordinates')
    return null
  }

  // Eğer konum zaten koordinat formatındaysa (lat,lng) doğrudan kullan
  if (locationName.includes(',')) {
    const parts = locationName.split(',')
    if (parts.length === 2) {
      const lat = Number.parseFloat(parts[0].trim())
      const lng = Number.parseFloat(parts[1].trim())
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
        return [lat, lng]
      }
    }
  }

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`)
    const data = await response.json()

    if (data && data.length > 0) {
      return [Number.parseFloat(data[0].lat), Number.parseFloat(data[0].lon)]
    }
    console.warn(`No coordinates found for location: ${locationName}`)
    return null
  }
  catch (error) {
    console.error('Error getting coordinates:', error)
    return null
  }
}

// Create loading location icon
const loadingIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `
    <div class="location-icon loading-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <path d="M12 8v8"/>
        <path d="M8 12l4-4 4 4"/>
      </svg>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
})

// Create truck icon
const truckIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `
    <div class="truck-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 3h15v13H1z"/>
        <path d="M16 8h4l3 3v5h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
})

// Create unloading location icon
const unloadingIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `
    <div class="location-icon unloading-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <path d="M12 16V8"/>
        <path d="M8 12l4 4 4-4"/>
      </svg>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
})

function clearMap() {
  routeLines.value.forEach(line => line.remove())
  routeLines.value = []
  markers.value.forEach(marker => marker.remove())
  markers.value = []
}

async function drawRoute() {
  if (!map.value)
    return

  clearMap()

  const validLocations = []
  const coordinates = []

  coordinates.push(props.loadingLocation)
  validLocations.push({ coords: props.loadingLocation, name: 'Loading Location' })

  const loadingMarker = L.marker(props.loadingLocation, { icon: loadingIcon })
  loadingMarker.bindPopup(t('positions.map.loadingLocation'))
  loadingMarker.addTo(map.value)
  markers.value.push(loadingMarker)

  const unloadingMarker = L.marker(props.unloadingLocation, { icon: unloadingIcon })
  unloadingMarker.bindPopup(t('positions.map.unloadingLocation'))
  unloadingMarker.addTo(map.value)
  markers.value.push(unloadingMarker)

  let shouldZoomToTruck = false
  let truckCoords = null

  if (props.truckLocations && props.truckLocations.length > 0) {
    // Geçerli konum bilgisi olan kamyonları filtrele
    const validTruckLocations = props.truckLocations.filter(loc => loc.lastLocation && loc.lastLocation.trim() !== '')

    for (let i = 0; i < validTruckLocations.length; i++) {
      const loc = validTruckLocations[i]
      const coords = await getCoordinates(loc.lastLocation)

      if (coords) {
        validLocations.push({ coords, name: loc.lastLocation })
        coordinates.push(coords)

        if (coordinates.length >= 2) {
          const lastTwo = coordinates.slice(-2)
          const line = L.polyline(lastTwo, {
            color: 'red',
            weight: 3,
            opacity: 0.7,
            zIndexOffset: -1000,
          }).addTo(map.value)
          routeLines.value.push(line)
        }

        if (i < validTruckLocations.length - 1) {
          const marker = L.marker(coords, {
            icon: L.divIcon({
              className: 'custom-div-icon',
              html: `<div class="marker-pin bg-red-500"></div>`,
              iconSize: [12, 12],
              iconAnchor: [6, 6],
            }),
            zIndexOffset: 1000,
          })
          marker.bindPopup(`Previous location: ${loc.lastLocation}`)
          marker.addTo(map.value)
          markers.value.push(marker)
        }
      }
    }

    if (coordinates.length > 1) { // En az bir tır konumu varsa (yükleme noktası + en az bir tır konumu)
      const lastCoords = coordinates[coordinates.length - 1]
      const lastLocation = validTruckLocations[validTruckLocations.length - 1]

      const truckMarker = L.marker(lastCoords, {
        icon: truckIcon,
        zIndexOffset: 2000,
      })
      truckMarker.bindPopup(t('positions.map.currentLocation', { location: lastLocation.lastLocation }))
      truckMarker.addTo(map.value)
      markers.value.push(truckMarker)

      const blueLine = L.polyline([lastCoords, props.unloadingLocation], {
        color: 'blue',
        weight: 3,
        opacity: 0.7,
        zIndexOffset: -1000,
      }).addTo(map.value)
      routeLines.value.push(blueLine)

      // Tırın son konumuna yakınlaştırmak için işaretleyelim
      shouldZoomToTruck = true
      truckCoords = lastCoords
    }
  }

  // Yakınlaştırma işlemini en son yapalım
  if (shouldZoomToTruck && truckCoords) {
    // Tırın son konumuna yakınlaştır
    map.value.setView(truckCoords, 12)
  }
  else {
    map.value.setView(props.loadingLocation, 12)
  }
}

// Initialize map
onMounted(() => {
  if (!mapContainer.value)
    return

  // Haritayı başlangıç konumuna odaklanmış olarak oluştur
  map.value = L.map(mapContainer.value)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map.value)

  // drawRoute fonksiyonu watch tarafından immediate: true ile çağrılacak
})

// Watch for changes in props
watch([() => props.truckLocations, () => props.loadingLocation, () => props.unloadingLocation], () => {
  // Harita her güncellendiğinde drawRoute fonksiyonunu çağır
  // Bu, haritanın odak noktasının da güncellenmesini sağlayacak
  if (map.value) {
    drawRoute()
  }
}, { immediate: true })

// Cleanup on unmount
onUnmounted(() => {
  if (map.value) {
    map.value.remove()
    map.value = null
  }
})
</script>

<template>
  <div ref="mapContainer" class="h-full w-full" />
</template>

<style>
.leaflet-container {
  width: 100%;
  height: 100%;
}

.custom-div-icon {
  background: transparent;
  border: none;
}

.marker-pin {
  border-radius: 50%;
  position: relative;
}

.truck-icon {
  width: 30px;
  height: 30px;
  color: #f3f63b;
  background: rgb(0, 0, 0);
  border-radius: 50%;
  padding: 3px;
  box-shadow: 0 0 0 2px #f3f63b;
}

.truck-icon svg {
  width: 100%;
  height: 100%;
}

.location-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  padding: 3px;
}

.loading-icon {
  color: #22c55e;
  background: white;
  box-shadow: 0 0 0 2px #22c55e;
}

.unloading-icon {
  color: #ef4444;
  background: white;
  box-shadow: 0 0 0 2px #ef4444;
}

.location-icon svg {
  width: 100%;
  height: 100%;
}
</style>
