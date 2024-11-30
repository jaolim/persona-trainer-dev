import { useState, useEffect} from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { sumBy, chain } from 'lodash'
import '../index.css'

export default function Charts() {
    const [trainings, setTrainings] = useState([]);

    const fetchTrainings = async () => {
        try {
            const response = await fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/gettrainings')
            const data = await response.json()
            const grouped = chain(data)
            .groupBy('activity')
            .map((value, key) => ({ activity: key, sessions: value }))
            .value()
            .map((type) => {
                type.minutes = sumBy(type.sessions, (session) => session.duration)
                return type
            })
            setTrainings(grouped.sort((a, b) => a.activity.localeCompare(b.activity)))
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchTrainings()
    }, [])

    return (
        <div>
            <h1 className="headers">Activities in minutes</h1>
            <ResponsiveContainer width="90%" height={500}>
                <BarChart width={150} height={40} data={trainings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="activity" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="minutes" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}