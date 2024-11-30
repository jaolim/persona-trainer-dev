import { useState, useEffect } from "react"
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { parseISO, addMinutes } from 'date-fns'

import '../index.css'
import "react-big-calendar/lib/css/react-big-calendar.css"


export default function CalendarView() {

  const [url, setUrl] = useState('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/gettrainings')
  const [trainings, setTrainings] = useState([]);

  const localizer = momentLocalizer(moment)

  const fetchTrainings = async (url) => {
    try {
      const response = await fetch(url)
      const data = await response.json()
      updateTrainings(data)
    } catch (e) {
      console.error(e);
    }
  };

const updateTrainings = (data) => {
  try {
      const mapped = data.map( (training) => {
          try {
              training.start = parseISO(training.date);
              training.end = addMinutes(parseISO(training.date), training.duration);
              training.title = `${training.customer.firstname} ${training.customer.lastname} - ${training.activity}`
              return training
          } catch (e) {
              console.error(e)
              return training
          }
      })
      setTrainings(mapped)
  } catch (e) {
      console.error(e)
  }
}

useEffect(() => {
  fetchTrainings(url)
}, [])

  return <>
    <h1 className="headers">Calendar view</h1>
    <div style={{ height: "80vh" }}>
      <Calendar
        localizer={localizer}
        events={trainings}
        startAccessor="start"
        endAccessor="end"
      />
    </div>
  </>
}