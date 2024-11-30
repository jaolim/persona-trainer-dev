import { useState, useEffect, useRef } from "react"
import { Button, Dialog, DialogTitle, DialogActions, TextField, DialogContent, MenuItem, Select, OutlinedInput, InputLabel } from "@mui/material";
import { AgGridReact } from "ag-grid-react"
import { formatISO, parseISO, constructNow, format } from 'date-fns'
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

import ExportCsv from './ExportCsv'

import '../index.css'
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";


export default function Training() {

    const [customer, setCustomer] = useState('')
    const [customers, setCustomers] = useState([]);
    const [trainings, setTrainings] = useState([]);
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(constructNow())
    const [training, setTraining] = useState({
        date: '',
        duration: '',
        activity: '',
        customer: '',
    })
//ag-grid definitions
    const [columnDefs, setColumnDefs] = useState([
        {
            field: 'date',
            sort: 'asc',
            minWidth: 50,
            maxWidth: 150,
            filter: 'agDateColumnFilter',
            valueGetter: params => {
                if (params.data.date != null){
                    return parseISO(params.data.date, new Date())
                } else {
                    return ('')
                }
            },
            cellRenderer: params => {
                if (params.data.date != null) {
                    const gridDate = parseISO(params.data.date, new Date());
                    const month = gridDate.getMonth() + 1;
                    const day = gridDate.getDate();
                    const year = gridDate.getFullYear();
                    const hours = gridDate.getHours().toString().padStart(2, '0');
                    const minutes = gridDate.getMinutes().toString().padStart(2, '0');
                    return `${day}.${month}.${year} ${hours}:${minutes}`;
                } else {
                    return ('')
                }
            }
        },
        { field: 'duration', minWidth: 50, maxWidth: 150 },
        { field: 'activity', flex: 2, minWidth: 50 },
        {
            field: 'customer',
            headerName: 'Customer',
            flex:2, 
            minWidth: 50,
            valueGetter: params => {
                if (params.data.customer != null) {
                    return `${params.data.customer.lastname} ${params.data.customer.firstname}`
                }
                else {
                    return ('')
                }

            }
        },
        {
            field: '_links.self.href',
            headerName: '',
            sortable: false,
            filter: false,
            maxWidth: 100,
            minWidth: 50,
            cellRenderer: params => <Button color="error" onClick={() => deleteTraining(params.data.id)}>Delete</Button>
        }
    ]);
    
    const gridRef = useRef();

    const defaultColDef = {
        sortable: true,
        filter: true
    };

    const autoSizeStrategy = {
        type: 'filCellContents',
    };

    const [exportParams, setExportParams] = useState({
        columnKeys: ['date', 'duration', 'activity', 'customer']
    })
// API calls
    const fetchCustomers = async () => {
        try {
            const response = await fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers')
            const data = await response.json();
            const mapped = data._embedded.customers.map((customer) => { //iterating received data to add combined first+last name for easier sorting
                customer.name = `${customer.lastname} ${customer.firstname}`
                return customer
            })
            setCustomers(mapped.sort((a, b) => a.name.localeCompare(b.name))); //alphabetically sorting the data based on names
        } catch (e) {
            console.error(e);
        }
    };

    const fetchTrainings = async () => {
        try {
            const response = await fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/gettrainings')
            const data = await response.json()
            setTrainings(data)
        } catch (e) {
            console.error(e);
        }
    };

    const addTraining = async () => {
        const train = {
            date: formatISO(date),
            activity: training.activity,
            duration: training.duration,
            customer: training.customer._links.self.href

        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(train)
        }

        try {
            const response = await fetch(`https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings`, options);
            const data = await response.json();
            setTraining({
                date: '',
                duration: '',
                activity: '',
                customer: '',
            })
            setCustomer('')
            setDate(constructNow())
            fetchTrainings();
        } catch (e) {
            console.error(e);
        }
    }

    const deleteTraining = async (id) => {
        const options = {
            method: 'DELETE'
        }

        try {
            if (confirm(`Delete training?`)) {
                const response = await fetch(`https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings/${id}`, options);
                fetchTrainings();
            }
        } catch (e) {
            console.error(e);
        }
    }
    const fetcher = () => {
        fetchCustomers();
        fetchTrainings();
    }
//handlers
    const handleSetCustomer = (event) => {
        setCustomer(event.target.value);
    }

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleChange = event => {
        setTraining({ ...training, [event.target.name]: event.target.value });
    }

    const handleSave = () => {
        addTraining()
        setOpen(false);
    }
//useEffects
    useEffect(() => {
        setTraining({ ...training, customer })
    }, [customer])

    useEffect(() => {
        fetcher()
    }, [])

    return (
        <>
            <div className="headers">
                <h1>Training sessions</h1>
            </div>
            <div className="content">
            <Button onClick={handleClickOpen}>Add training</Button>
            <ExportCsv gridRef={gridRef} exportParams={exportParams} />
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>New training</DialogTitle>
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            name="date"
                            format="dd-MM-yyyy HH:mm"
                            ampm={false}
                            onChange={(date) => setDate(date)}
                            value={date}
                        />
                    </LocalizationProvider>
                    <TextField
                        required
                        id="activity"
                        name="activity"
                        label="Activity"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={handleChange}
                        value={training.activity}
                    />
                    <TextField
                        required
                        id="duration"
                        name="duration"
                        label="Duration"
                        type="number"
                        fullWidth
                        variant="standard"
                        onChange={handleChange}
                        value={training.duration}
                    />
                    <InputLabel id="customerLabel">Customer</InputLabel>
                    <Select
                        id="customer"
                        style={{ minWidth: 150 }}
                        value={customer}
                        onChange={handleSetCustomer}
                        input={<OutlinedInput />}
                    >
                        {customers.map((customer) => (
                            <MenuItem
                                key={customer._links.self.href}
                                value={customer}
                            >
                                {customer.lastname} {customer.firstname}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
            <div className="ag-theme-material" style={{ height: 600, width: "95%", maxWidth:1000 }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={trainings}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    autoSizeStrategy={autoSizeStrategy}
                    accentedSort={true}
                />
            </div>
            </div>
        </>);
}