<script setup lang="ts">
import { usePosition } from '@/composables/usePosition'

const props = defineProps<{ positionId: string }>()
const { position, loading, error } = usePosition(props.positionId)
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center py-12">
    <Spinner class="h-8 w-8" />
  </div>

  <Alert v-else-if="error" variant="destructive" class="my-8">
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>
      Error loading trip details.
    </AlertDescription>
  </Alert>

  <div v-else-if="position" class="grid gap-6">
    <!-- Truck Details -->
    <Card>
      <CardHeader>
        <CardTitle>Truck Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <Label>Truck Plate</Label>
            <div>{{ position.truckPlate }}</div>
          </div>
          <div>
            <Label>Trailer Plate</Label>
            <div>{{ position.trailerPlate }}</div>
          </div>
          <div>
            <Label>Country of Loading</Label>
            <div>{{ position.countryOfLoading }}</div>
          </div>
          <div>
            <Label>Country of Unloading</Label>
            <div>{{ position.countryOfUnloading }}</div>
          </div>
          <div>
            <Label>Place of Loading</Label>
            <div>{{ position.placeOfLoading }}</div>
          </div>
          <div>
            <Label>Place of Unloading</Label>
            <div>{{ position.placeOfUnloading }}</div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Customs Details -->
    <Card>
      <CardHeader>
        <CardTitle>Customs Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <Label>Customs</Label>
            <div>{{ position.customs }}</div>
          </div>
          <div>
            <Label>Entrance Gate</Label>
            <div>{{ position.entranceGate }}</div>
          </div>
          <div>
            <Label>Exit Gate</Label>
            <div>{{ position.exitGate }}</div>
          </div>
          <div>
            <Label>Receiver</Label>
            <div>{{ position.receiver }}</div>
          </div>
          <div>
            <Label>Sender</Label>
            <div>{{ position.sender }}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
