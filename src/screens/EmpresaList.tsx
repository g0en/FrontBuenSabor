import { Button, Card, CardActions, CardHeader, IconButton, Tooltip } from "@mui/material";

function EmpresaList(){
    return (
        <>
            <h1>Empresas</h1>
            <Button>Crear Empresa</Button>
            <Card>
                <CardHeader title="MCC Company" subheader="Razon Social"></CardHeader>
                <CardActions>
                    <Tooltip title="Editar">
                        <IconButton>
                            
                        </IconButton>
                    </Tooltip>
                </CardActions>
            </Card>
        </>
    )
}

export default EmpresaList;