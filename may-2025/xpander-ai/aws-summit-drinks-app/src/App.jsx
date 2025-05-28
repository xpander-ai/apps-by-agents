import './App.css'
import AppHeader from './components/Header'
import DrinkSpotCard from './components/DrinkSpotCard'
import drinkSpots from './data/drinkSpots'
import { Grid } from '@cloudscape-design/components'

function App() {
  return (
    <>
      <AppHeader />
      <div style={{ padding: '2rem' }}>
        <Grid gridDefinition={[{ colspan: 4 }, { colspan: 4 }, { colspan: 4 }]}> 
          {drinkSpots.map((spot) => (
            <DrinkSpotCard key={spot.id} spot={spot} />
          ))}
        </Grid>
      </div>
    </>
  )
}

export default App
