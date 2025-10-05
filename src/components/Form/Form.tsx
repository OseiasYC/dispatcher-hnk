import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Typography,
  Paper,
  Button,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide
} from "@mui/material";
import { AddCircle, RemoveCircle, CheckCircle } from "@mui/icons-material";
import styles from "./Form.module.scss";

interface Produto {
  codigo: string;
  pacotes: string;
  descricao: string;
}

const Form: React.FC = () => {
  const [tipo, setTipo] = useState("alterar");
  const [pedido, setPedido] = useState("");
  const [cliente, setCliente] = useState("");
  const [pdv, setPdv] = useState("");
  const [observacao, setObservacao] = useState("");
  const [produtos, setProdutos] = useState<Produto[]>([
    { codigo: "", pacotes: "", descricao: "" },
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    setPedido("");
    setCliente("");
    setPdv("");
    setProdutos(
      tipo === "incluir" || tipo === "alterar"
        ? [{ codigo: "", pacotes: "", descricao: "" }]
        : []
    );
  }, [tipo]);

  const handleProdutoChange = (index: number, field: keyof Produto, value: string) => {
    const novosProdutos = [...produtos];
    novosProdutos[index] = { ...novosProdutos[index], [field]: value };
    setProdutos(novosProdutos);
  };

  const incluirProduto = () => {
    setProdutos([...produtos, { codigo: "", pacotes: "", descricao: "" }]);
  };

  const removerProduto = (index: number) => {
    setProdutos(produtos.filter((_, i) => i !== index));
  };

  const isCodigoValido = (codigo: string) => codigo.startsWith("90") && codigo.length === 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const codigosInvalidos = produtos.some((p) => !isCodigoValido(p.codigo));
    if (codigosInvalidos) return;

    const data = { tipo, pedido, cliente, pdv, produtos, observacao };
    console.log("Dados enviados:", data);

    // Copiar para área de transferência
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      console.log("Copiado para área de transferência!");
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }

    setOpenDialog(true);
  };

  const resetForm = () => {
    setTipo("alterar");
    setPedido("");
    setCliente("");
    setPdv("");
    setObservacao("");
    setProdutos([{ codigo: "", pacotes: "", descricao: "" }]);
    setSubmitted(false);
  };

  return (
    <Paper
      elevation={3}
      sx={{ p: 3, maxWidth: 800, mx: "auto", mt: 4, borderRadius: 3 }}
    >
      <Typography variant="h4" className={styles.titulo} mt={4}>
        <img src="/hnk-logo.png" alt="logo HNK" className={styles.logo} />
        Despachos
      </Typography>

      <Box component="form" onSubmit={handleSubmit} mt={3}>
        <FormControl
          component="fieldset"
          fullWidth
          margin="normal"
          sx={{ textAlign: "center" }}
        >
          <RadioGroup
            row
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            sx={{ justifyContent: "space-around" }}
          >
            <FormControlLabel value="alterar" control={<Radio />} label="🔀 Alterar" />
            <FormControlLabel value="incluir" control={<Radio />} label="⏫ Incluir" />
            <FormControlLabel value="cancelar" control={<Radio />} label="❌ Cancelar" />
          </RadioGroup>
        </FormControl>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" mb={1} fontWeight={600}>
          {tipo === "incluir" ? "Qual setor e PDV?" : "Qual o pedido?"}
        </Typography>
        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", sm: "2fr 3fr" }}
          gap={2}
          mb={2}
        >
          <TextField
            label={tipo === "incluir" ? "Setor" : "Nº Pedido"}
            required={tipo !== "cancelar"}
            value={pedido}
            onChange={(e) => {
              let valor = e.target.value.replace(/\D/g, "");
              if (tipo === "incluir") valor = valor.slice(0, 3);
              if (tipo === "alterar") valor = valor.slice(0, 4);
              setPedido(valor);
            }}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              maxLength: tipo === "incluir" ? 3 : tipo === "alterar" ? 4 : undefined,
            }}
            fullWidth
          />

          <TextField
            label={tipo === "incluir" ? "PDV" : "Cliente"}
            required={tipo !== "cancelar"}
            value={tipo === "incluir" ? pdv : cliente}
            onChange={(e) => {
              if (tipo === "incluir") {
                let valor = e.target.value.replace(/\D/g, "").slice(0, 8);
                if (valor.length > 4) valor = valor.slice(0, 4) + "-" + valor.slice(4);
                setPdv(valor);
              } else {
                setCliente(e.target.value.toUpperCase());
              }
            }}
            inputProps={{
              inputMode: tipo === "incluir" ? "numeric" : undefined,
              pattern: tipo === "incluir" ? "[0-9]*" : undefined,
            }}
            fullWidth
          />
        </Box>

        {(tipo === "incluir" || tipo === "alterar") && produtos.length > 0 && (
          <Box>
            <Typography variant="subtitle1" mb={1} fontWeight={600}>
              Quais produtos?
            </Typography>

            {produtos.map((produto, index) => {
              const codigoValido = isCodigoValido(produto.codigo);
              return (
                <Box
                  key={index}
                  mb={2}
                  sx={{ border: "1px solid #ddd", p: 2, borderRadius: 1 }}
                >
                  <Box
                    display="grid"
                    gridTemplateColumns={{ xs: "2fr 1fr" }}
                    gap={2}
                    mb={2}
                  >
                    <TextField
                      label="Cód. Produto"
                      required
                      value={produto.codigo}
                      onChange={(e) => {
                        const valor = e.target.value.replace(/\D/g, "").slice(0, 6);
                        handleProdutoChange(index, "codigo", valor);
                      }}
                      inputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                        maxLength: 6,
                      }}
                      fullWidth
                      error={submitted && !codigoValido}
                      helperText={
                        submitted && !codigoValido
                          ? "Código inválido: deve ter 6 dígitos e começar com 90"
                          : ""
                      }
                    />

                    <TextField
                      label="Pacotes"
                      required
                      value={produto.pacotes}
                      onChange={(e) =>
                        handleProdutoChange(index, "pacotes", e.target.value.replace(/\D/g, ""))
                      }
                      inputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                      }}
                      fullWidth
                    />
                  </Box>

                  <TextField
                    label="Descrição"
                    required
                    value={produto.descricao}
                    onChange={(e) =>
                      handleProdutoChange(index, "descricao", e.target.value.toUpperCase())
                    }
                    fullWidth
                  />

                  {produtos.length > 1 && (
                    <Box textAlign="right" mt={1}>
                      <IconButton
                        color="error"
                        onClick={() => removerProduto(index)}
                        size="large"
                      >
                        <RemoveCircle />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              );
            })}

            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddCircle />}
              onClick={incluirProduto}
              sx={{ mt: 1 }}
            >
              Incluir outro produto
            </Button>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />
        <Typography variant="subtitle1" mb={1} fontWeight={600}>
          Alguma observação?
        </Typography>
        <TextField
          label="Ex. mudar pagamento, remover pedido etc."
          fullWidth
          multiline
          rows={3}
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
        />

        <Divider sx={{ my: 3 }} />
        <Box textAlign="center" mt={2}>
          <Button type="submit" variant="contained" color="success">
            Enviar
          </Button>
        </Box>
      </Box>

      {/* Dialog estilizado */}
      <Dialog
        open={openDialog}
        onClose={() => {
          window.location.reload();
        }}
        TransitionComponent={(props) => <Slide direction="up" {...props} />}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            textAlign: "center",
          },
        }}
      disableScrollLock>
        <DialogTitle>
          <CheckCircle color="success" sx={{ fontSize: 60 }} />
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Despacho Copiado!
          </Typography>
          <Typography color="text.secondary">
            Deseja compartilhar este despacho via WhatsApp?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => {
              window.location.reload();
            }}
          >
            NÃO
          </Button>
          <Button
            color="success"
            variant="contained"
            
            onClick={() => {
              const message = `Pedido enviado:\nTipo: ${tipo}\nPedido: ${pedido}\nCliente: ${cliente}\nPDV: ${pdv}\nProdutos: ${produtos
                .map(
                  (p) => `${p.codigo} - ${p.pacotes}x ${p.descricao}`
                )
                .join("\n")}\nObservação: ${observacao}`;
              const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
                message
              )}`;
              window.open(whatsappUrl, "_blank");
              setOpenDialog(false);
              resetForm();
            }}
          >
            SIM
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Form;
