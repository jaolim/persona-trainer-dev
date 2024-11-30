import { useState, useEffect, useRef } from "react"
import { Button, Dialog, DialogTitle, DialogActions } from "@mui/material";
import { AgGridReact } from "ag-grid-react"

import CustomerDialogContent from './CustomerDialogContent'
import UpdateCustomer from './UpdateCustomer'
import ExportCsv from './ExportCsv'

import '../index.css'
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

export default function Customer() {
    const gridRef = useRef();

    const [customers, setCustomers] = useState([]);
    const [open, setOpen] = useState(false);
    const [customer, setCustomer] = useState({
        firstname: '',
        lastname: '',
        address: '',
        postcode: '',
        city: '',
        email: '',
        phone: ''
    })

    const [exportParams, setExportParams] = useState({
        columnKeys: ['firstname', 'lastname', 'streetaddress', 'postcode', 'city', 'email', 'phone']
    })
    
    const [columnDefs, setColumnDefs] = useState([
        { field: 'firstname', flex: 1.5, minWidth: 50 },
        { field: 'lastname', sort: 'asc', flex: 1.5, minWidth: 50 },
        { field: 'streetaddress', headerName: "Address", flex: 2, minWidth: 50 },
        { field: 'postcode', flex: 2, minWidth: 50 },
        { field: 'city', flex: 2, minWidth: 50 },
        { field: 'email', flex: 2, minWidth: 50 },
        { field: 'phone', flex: 2, minWidth: 50 },
        {
            field: '_links.self.href',
            headerName: '',
            sortable: false,
            filter: false,
            cellStyle: {
                'textAlign': 'left'
            },
            maxWidth: 100,
            minWidth: 50,
            cellRenderer: params => <Button color="error" onClick={() => deleteCustomer(params.data._links.self.href)}>Delete</Button>
        },
        {
            field: '_links.self.href',
            headerName: '',
            sortable: false,
            filter: false,
            type: 'left-aligned',
            maxWidth: 100,
            minWidth: 50,
            cellRenderer: params => <UpdateCustomer updateCustomer={updateCustomer} currentCustomer={params.data} />
        },
    ]);

    const defaultColDef = {
        sortable: true,
        filter: true
    };

    const autoSizeStrategy = {
        type: 'filCellContents',
    };

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleChange = event => {
        setCustomer({ ...customer, [event.target.name]: event.target.value });
    }

    const handleSave = () => {
        addCustomer(customer)
        setOpen(false);
    }

    const fetchCustomers = async () => {
        try {
            const response = await fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers')
            const data = await response.json();
            setCustomers(data._embedded.customers);
        } catch (e) {
            console.error(e);
        }
    }

    const deleteCustomer = async (url) => {
        const options = {
            method: 'DELETE'
        }

        try {
            if (confirm(`Delete customer?`)) {
                const response = await fetch(url, options);
                fetchCustomers();
            }
        } catch (e) {
            console.error(e);
        }
    }

    const addCustomer = async (customer) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(customer)
        }

        try {
            const response = await fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers', options);
            const data = await response.json();
            fetchCustomers();
        } catch (e) {
            console.error(e);
        }
    }

    const updateCustomer = async (url, customer) => {
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(customer)
        }

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            fetchCustomers();
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        fetchCustomers()
    }, [])

    return (
        <>
            <h1 className="headers">Customers</h1>
            <Button onClick={handleClickOpen}>Add customer</Button>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>New customer</DialogTitle>
                <CustomerDialogContent customer={customer} handleChange={handleChange} />
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
            <ExportCsv gridRef={gridRef} exportParams={exportParams}/>
            <div className="ag-theme-material" style={{ height: 600, width: "95%", maxWidth:1500 }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={customers}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    autoSizeStrategy={autoSizeStrategy}
                    accentedSort={true}
                />
            </div>
        </>);
}