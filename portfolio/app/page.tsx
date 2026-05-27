import { BootSequence } from '@/components/scenes/BootSequence'
import { ServicesScene } from '@/components/scenes/ServicesScene'
import { SystemArchitecture } from '@/components/scenes/SystemArchitecture'
import { CareerJourney } from '@/components/scenes/CareerJourney'
import { GalaxyWrapper } from '@/components/scenes/GalaxyWrapper'
import { ReliabilityCenter } from '@/components/scenes/ReliabilityCenter'
import { NeuralNetwork } from '@/components/scenes/NeuralNetwork'
import { BuilderLab } from '@/components/scenes/BuilderLab'
import { FutureScene } from '@/components/scenes/FutureScene'

export default function Home() {
  return (
    <>
      {/* Scene 1: Boot Sequence / Hero */}
      <BootSequence />

      {/* Scene 2: Services — What I Build For You */}
      <ServicesScene />

      {/* Scene 3: System Architecture */}
      <SystemArchitecture />

      {/* Scene 3: Career Journey (horizontal scroll) */}
      <CareerJourney />

      {/* Scene 4: GitHub Galaxy */}
      <GalaxyWrapper />

      {/* Scene 5: Reliability Control Center */}
      <ReliabilityCenter />

      {/* Scene 6: Skills Neural Network */}
      <NeuralNetwork />

      {/* Scene 7: Builder Lab */}
      <BuilderLab />

      {/* Final Scene: The Future */}
      <FutureScene />
    </>
  )
}
