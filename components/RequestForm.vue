<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { vAutoAnimate } from '@formkit/auto-animate/vue'

import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()
const isLoading = ref(false)

const formSchema = toTypedSchema(z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır.'),
  email: z.string().email('Geçerli bir e-posta adresi girin.'),
  requestType: z.enum(['BUYER', 'SELLER'], {
    required_error: 'Lütfen bir talep türü seçin.',
  }),
  message: z.string().min(10, 'Mesajınız en az 10 karakter olmalıdır.').max(500, 'Mesajınız 500 karakteri geçemez.'),
}))

const { handleSubmit } = useForm({
  validationSchema: formSchema,
})

const emit = defineEmits(['submit'])

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true
  try {
    // Form verilerini parent componente emit et
    emit('submit', values)
  }
  catch (error) {
    toast({
      title: 'Hata',
      description: 'Talep gönderilirken bir hata oluştu. Lütfen tekrar deneyin.',
      variant: 'destructive',
    })
  }
  finally {
    isLoading.value = false
  }
})
</script>

<template>
  <form class="space-y-6" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Adınız Soyadınız</FormLabel>
        <FormControl>
          <Input type="text" placeholder="İsminizi girin..." v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>E-posta Adresiniz</FormLabel>
        <FormControl>
          <Input type="email" placeholder="eposta@adresiniz.com" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="requestType">
      <FormItem class="space-y-3">
        <FormLabel>Talep Türü</FormLabel>
        <FormControl>
          <RadioGroup
            class="flex flex-col space-y-1"
            v-bind="componentField"
          >
            <FormItem class="flex items-center space-y-0 gap-x-3">
              <FormControl>
                <RadioGroupItem value="BUYER" />
              </FormControl>
              <FormLabel class="font-normal">
                Alıcıyım (Mülk arıyorum)
              </FormLabel>
            </FormItem>
            <FormItem class="flex items-center space-y-0 gap-x-3">
              <FormControl>
                <RadioGroupItem value="SELLER" />
              </FormControl>
              <FormLabel class="font-normal">
                Satıcıyım (Mülk satıyorum/kiralıyorum)
              </FormLabel>
            </FormItem>
          </RadioGroup>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="message">
      <FormItem>
        <FormLabel>Talebiniz</FormLabel>
        <FormControl>
          <Textarea
            placeholder="Lütfen talebinizi detaylı olarak açıklayın (örn: 3+1, deniz manzaralı, 5.000.000 TL bütçeli bir daire arıyorum)."
            class="resize-none"
            v-bind="componentField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button type="submit" class="w-full" :disabled="isLoading">
      <span v-if="isLoading">Gönderiliyor...</span>
      <span v-else>Talebi Gönder</span>
    </Button>
  </form>
</template> 