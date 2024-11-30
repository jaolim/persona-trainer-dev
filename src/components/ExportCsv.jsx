import { useState, useCallback } from "react"
import { Button, DialogContent, Dialog } from "@mui/material";
import '../index.css'

export default function ExportCsv({ gridRef, exportParams }) {
    const [open, setOpen] = useState(false)
    const [csv, setCsv] = useState('')

    const handleClick = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleClickPopup = (event) => {
        handleClick();
        setCsv(gridRef.current.api.getDataAsCsv(exportParams))
    }

    const onBtnExport = useCallback(() => {
        gridRef.current.api.exportDataAsCsv(exportParams);
    }, []);


    return (
        <>
            <Button type="button" onClick={handleClickPopup}>
                Export / Preview CSV
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth={true}
                maxWidth={"md"}
            >
                <DialogContent>
                   <p><Button onClick={onBtnExport}>Download CSV</Button></p>
                    <textarea
                        id="csvExport"
                        defaultValue={csv}
                        style={{ height: 500, width: "90vh" }}
                        disabled={true}
                    ></textarea>
                </DialogContent>
            </Dialog>
        </>
    )
}
