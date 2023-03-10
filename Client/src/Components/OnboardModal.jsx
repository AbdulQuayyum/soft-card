import { useState, useEffect } from 'react'
import Modal from 'react-modal'

import Styles from '../Styles/Index.js'
import CustomButton from './CustomButton'
import { useGlobalContext } from '../Context/Index'
import { GetParams, SwitchNetwork } from '../Utilities/Onboard'

const OnboardModal = () => {
  const [modalIsOpen, setIsOpen] = useState(false)
  const { updateCurrentWalletAddress } = useGlobalContext()
  const [step, setStep] = useState(-1)

  async function resetParams() {
    const currentStep = await GetParams()
    setStep(currentStep.step)
    setIsOpen(currentStep.step !== -1)
  }

  useEffect(() => {
    resetParams()

    window?.ethereum?.on('chainChanged', () => {
      resetParams()
    })

    window?.ethereum?.on('accountsChanged', () => {
      resetParams()
    })
  }, [])

  const generateStep = (st) => {
    switch (st) {
      case 0:
        return (
          <>
            <p className={Styles.modalText}>
              You don't have Core Wallet installed!
            </p>
            <CustomButton
              title="Download Core"
              handleClick={() => window.open('https://core.app/', '_blank')}
            />
          </>
        )

      case 1:
        return (
          <>
            <p className={Styles.modalText}>
              You haven't connected your account to Core Wallet!
            </p>
            <CustomButton
              title="Connect Account"
              handleClick={updateCurrentWalletAddress}
            />
          </>
        )

      case 2:
        return (
          <>
            <p className={Styles.modalText}>
              You're on a different network. Switch to Fuji C-Chain.
            </p>
            <CustomButton title="Switch" handleClick={SwitchNetwork} />
          </>
        )

      case 3:
        return (
          <>
            <p className={Styles.modalText}>
              Oops, you don't have AVAX tokens in your account
            </p>
            <CustomButton
              title="Grab some test tokens"
              handleClick={() => window.open('https://faucet.avax.network/', '_blank')}
            />
          </>
        )

      default:
        return <p className={Styles.modalText}>Good to go!</p>
    }
  }

  return (
    <Modal
      isOpen={modalIsOpen}
      className={`absolute inset-0 ${Styles.flexCenter} flex-col ${Styles.glassEffect}`}
      overlayClassName="Overlay"
    >
      {generateStep(step)}
    </Modal>
  )
}

export default OnboardModal