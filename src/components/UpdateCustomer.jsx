import { useState } from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

import CustomerDialogContent from './CustomerDialogContent'

import '../index.css'

export default function UpdateCustomer( { updateCustomer, currentCustomer }) {

    const [customer, setCustomer] = useState(currentCustomer);
    const [open, setOpen] = useState(false);

    const url = currentCustomer._links.self.href;

    const handleClickOpen = () => {
        console.log(customer)
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleChange = event => {
        setCustomer({...customer, [event.target.name]: event.target.value});
    }

    const handleSave = () => {
        console.log(customer);
        updateCustomer(url, customer);
        setOpen(false);
    }

    return (
        <>
            <Button onClick={handleClickOpen}>Edit</Button>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Update customer</DialogTitle>
                <CustomerDialogContent customer={customer} handleChange={handleChange} />
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}