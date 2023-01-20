import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Styles from '../Styles/Index'
import { CustomButton, CustomInput, GameLoad, PageHOC } from "../Components/Index"
import { useGlobalContext } from '../Context/Index'

const CreateBattle = () => {
  const { contract, gameData, battleName, setBattleName, setErrorMessage } = useGlobalContext()
  const [waitBattle, setWaitBattle] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (gameData?.activeBattle?.battleStatus === 1) {
      navigate(`/Battle/${gameData.activeBattle.name}`)
    } else if (gameData?.activeBattle?.battleStatus === 0) {
      setWaitBattle(true)
    }
  }, [gameData])

  const handleClick = async () => {
    if (battleName === '' || battleName.trim() === '') return null

    try {
      await contract.createBattle(battleName)

      setWaitBattle(true)
    } catch (error) {
      setErrorMessage(error)
    }
  }

  return (
    <>
      {waitBattle && <GameLoad />}

      <div className="flex flex-col mb-5">
        <CustomInput
          label="Battle"
          placeHolder="Enter battle name"
          value={battleName}
          handleValueChange={setBattleName}
        />

        <CustomButton
          title="Create Battle"
          handleClick={handleClick}
          restStyles="mt-6"
        />
      </div>
      <p className={Styles.infoText} onClick={() => navigate('/JoinBattle')}>
        Or join already existing battles
      </p>
    </>
  )
}

export default PageHOC(
  CreateBattle,
  <>Create <br /> a new Battle</>,
  <>Create your own battle and wait for other players to join you</>,
)