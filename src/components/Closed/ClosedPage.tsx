import { Container, Box, Typography, Button, Paper } from "@mui/material";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function ClosedPage() {
  const hoje = new Date();
  const diaAbertura = new Date(hoje);
  diaAbertura.setDate(hoje.getDate() + 1);
  diaAbertura.setHours(0, 0, 0, 0);

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 3,
          textAlign: "center",
          bgcolor: "#ffffff",
          width: "90%",
          maxWidth: 500,
        }}
      >
        <Box mb={2} color="#035e3c">
          <WarningAmberIcon sx={{ fontSize: 50 }} />
        </Box>

        <Typography variant="h4" sx={{ color: "#035e3c", fontWeight: "bold" }} gutterBottom>
          Serviço Fechado
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          As vendas e alterações estão fechadas no momento.
        </Typography>

        <Typography variant="body2" sx={{ color: "#035e3c", fontWeight: "medium", mb: 5 }}>
          Nosso serviço funciona de segunda a sexta das <strong>00h</strong> às <strong>17h</strong>.
        </Typography>

        <Button
          variant="contained"
          sx={{
            bgcolor: "#035e3c",
            "&:hover": { bgcolor: "#024d32" },
          }}
          onClick={() => window.location.reload()}
        >
          Atualizar
        </Button>
      </Paper>
    </Container>
  );
}
