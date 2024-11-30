import { useState, useEffect, useMemo, useRef, useCallback } from "react"

import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

import { parseISO } from 'date-fns'

import { BarChart, Bar, ResponsiveContainer } from 'recharts';

import { Button, Dialog, DialogTitle, DialogActions, TextField, DialogContent, MenuItem, Select, OutlinedInput } from "@mui/material";

import ExportCsv from './ExportCsv'

export default function Home() {
  const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [openCsv, setOpenCsv] = useState(false)
  const [csv, setCsv] = useState('')

  const handleClickCsv = () => {
    setOpenCsv(true)
  }

  const handleCloseCsv = () => {
    setOpenCsv(false)
  }

  const [test, setTest] = useState([
    {
      value1: "test1:1",
      value2: "asdf",
      value3: "qwerty",
      date: "2024-11-23T13:44:45.868+00:00"
    },
    {
      value1: "test1:2",
      value2: "fdas",
      value3: "foo",
      date: "2024-11-23T13:44:45.868+00:00"
    },
    {
      value1: "test1:3",
      value2: "bar",
      value3: "1234",
      date: "2024-11-23T13:44:45.868+00:00"
    }
  ]);

  const [test2, setTest2] = useState([
    {
      tvalue1: "test1",
      tvalue2: "qwer",
      date: "2024-11-23T13:44:45.868+00:00"
    },
    {
      tvalue1: "test4",
      tvalue2: "zxcv",
      date: "2014-02-11T11:30:30"
    },
  ]);

  const handleChangeCsv = event => {
    console.log(event)
    setCsv({ ...csv, [event.target.name]: event.target.value });
  }

  const gridRef = useRef();

  const onBtnExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  const onBtnUpdate = useCallback(() => {
    document.querySelector("#csvResult").value =
      gridRef.current.api.getDataAsCsv();
  }, []);

  const [columnDefs, setColumnDefs] = useState([

    { field: 'value1', flex: 2, maxWidth: 150, minWidth: 50 },
    { field: 'value2', flex: 2, maxWidth: 150, minWidth: 50 },
    { field: 'value3', flex: 3, maxWidth: 150, minWidth: 50 },
    {
      field: 'date',
      cellDataType: 'date',
      flex: 4,
      maxWidth: 150,
      minWidth: 50,
      valueGetter: params => {
        return parseISO(params.data.date, new Date())
      }
    }

  ]);

  const defaultColDef = {
    sortable: true,
    filter: true
  };

  const autoSizeStrategy = {
    type: 'filCellContents',
  };

  const printTest = () => {
    let name = "asdf"
    test2.map(tes => {
      console.log(tes);
    });
    test2.forEach(customer => {
      if (customer.tvalue1 == "test1") {
        console.log(customer);
        name = customer.tvalue2;
      }
    })
    return name;
  }

  const handleClickPopup = (event) => {
    handleClickCsv();
    setCsv(gridRef.current.api.getDataAsCsv())
  }

  return (
    <>
      <div style={containerStyle}>
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={{ margin: "10px 0" }}>
            <button onClick={onBtnExport}>Download CSV export file</button>
            <button onClick={onBtnUpdate}>Show CSV export content text</button>
            <ExportCsv gridRef={gridRef}/>
          </div>
          <div
            style={{
              flex: "1 1 0",
              position: "relative",
              display: "flex",
              flexDirection: "row",
              gap: "20px",
            }}
          >
            <div
              style={{ height: 600, width: "95%" }}
              className={
                "ag-theme-quartz"
              }
            >
              <AgGridReact
                ref={gridRef}
                rowData={test}
                defaultColDef={defaultColDef}
                suppressExcelExport={true}
                columnDefs={columnDefs}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <textarea
          id="csvResult"
          style={{ minHeight: 50, minWidth: 100 }}
          placeholder="Click the Show CSV export content button to view exported CSV here"
        ></textarea>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart width={150} height={40} data={data}>
          <Bar dataKey="uv" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );

  /*
      <div>
        <Dialog
          open={openCsv}
          onClose={handleCloseCsv}
        >
          <DialogContent>
            <Button onClick={onBtnExport}>Download CSV</Button>
            <p>Preview</p>
            <textarea
              id="csvExport"
              defaultValue={csv}
              style={{ height: 200, width: 500 }}
              disabled={true}
            ></textarea>
          </DialogContent>
        </Dialog>
      </div>
      <div> 
  */

  /*return (
     <div>
       <h3>Welcome to personal trainer app!</h3>
       <Button onClick={onBtnExport}
       >Export CSV</Button>
       <div className="ag-theme-material" ref={gridRef} style={{ height: 600, width: "95%" }}>
         <AgGridReact
           ref={gridRef}
           suppressExcelExport={true}
           rowData={test}
           columnDefs={columnDefs}
           defaultColDef={defaultColDef}
           autoSizeStrategy={autoSizeStrategy}
           accentedSort={true}
         />
       </div>
 
       <p>
         {printTest()}
       </p>
     </div>
   );
   */
}

/*
"use strict";

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { CsvExportModule } from "@ag-grid-community/csv-export";
ModuleRegistry.registerModules([ClientSideRowModelModule, CsvExportModule]);

const GridExample = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState([
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxster", price: 72000 },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      minWidth: 100,
      flex: 1,
    };
  }, []);
  const popupParent = useMemo(() => {
    return document.body;
  }, []);
  const [columnDefs, setColumnDefs] = useState([
    { field: "make" },
    { field: "model" },
    { field: "price" },
  ]);

  const onBtnExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  const onBtnUpdate = useCallback(() => {
    document.querySelector("#csvResult").value =
      gridRef.current.api.getDataAsCsv();
  }, []);

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ margin: "10px 0" }}>
          <button onClick={onBtnUpdate}>Show CSV export content text</button>
          <button onClick={onBtnExport}>Download CSV export file</button>
        </div>
        <div
          style={{
            flex: "1 1 0",
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: "20px",
          }}
        >
          <div id="gridContainer" style={{ flex: "1" }}>
            <div
              style={gridStyle}
              className={
                "ag-theme-quartz"
              }
            >
              <AgGridReact
                ref={gridRef}
                rowData={rowData}
                defaultColDef={defaultColDef}
                suppressExcelExport={true}
                popupParent={popupParent}
                columnDefs={columnDefs}
              />
            </div>
          </div>
          <textarea
            id="csvResult"
            style={{ flex: "1" }}
            placeholder="Click the Show CSV export content button to view exported CSV here"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
window.tearDownExample = () => root.unmount();
*/