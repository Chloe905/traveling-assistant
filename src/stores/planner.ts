import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { AiPlanResult } from '@/types/models'

export const usePlannerStore = defineStore('planner', () => {
  const latestPlan = ref<AiPlanResult | null>(null)
  const isPlanning = ref(false)

  const setPlanning = (status: boolean) => {
    isPlanning.value = status
  }

  const setLatestPlan = (plan: AiPlanResult | null) => {
    latestPlan.value = plan
  }

  return {
    latestPlan,
    isPlanning,
    setPlanning,
    setLatestPlan
  }
})
