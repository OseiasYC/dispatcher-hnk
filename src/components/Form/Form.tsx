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
  Slide,
} from "@mui/material";
import { AddCircle, RemoveCircle, CheckCircle } from "@mui/icons-material";
import styles from "./Form.module.scss";

interface Produto {
  codigo: string;
  pacotes: string;
  descricao: string;
  valor: string;
}

const gerarId = (): string => {
  const array = new Uint8Array(5);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => ("abcdefghijklmnopqrstuvwxyz0123456789")[b % 36])
    .join("");
};

// Função para formatar valor em reais: 1234 -> "12,34"
const formatarValor = (valor: string): string => {
  const somenteNumeros = valor.replace(/\D/g, "");
  if (!somenteNumeros) return "";
  const numero = (parseInt(somenteNumeros, 10) / 100).toFixed(2);
  return numero.replace(".", ",");
};

const formatarMensagem = (data: {
  tipo: string;
  pedido: string;
  cliente: string;
  pdv: string;
  produtos: Produto[];
  observacao: string;
  id: string;
}) => {
  const simbolosTipo: Record<string, string> = {
    alterar: "🔀 ALTERAR",
    digitar: "🔠 DIGITAR",
    cancelar: "❌ CANCELAR",
  };

  const titulo = `*${simbolosTipo[data.tipo]}* - \`${data.id}\``;

  const clienteLinha =
    data.tipo === "digitar"
      ? `*${data.pedido}* - ${data.pdv}`
      : data.cliente
        ? `*${data.pedido}* - ${data.cliente}`
        : `*${data.pedido}*`;

  const produtosTexto =
    data.produtos && data.produtos.length > 0
      ? data.produtos
        .filter((p) => p.codigo || p.pacotes || p.descricao || p.valor)
        .map(
          (p) =>
            `* *${p.codigo}* - ${p.pacotes} PC - ${p.descricao}${p.valor ? ` - *_R$${p.valor}_*` : ""
            }`
        )
        .join("\n\n")
      : "";

  const observacaoTexto = data.observacao
    ? `\n\nObs.\n_${data.observacao}_`
    : "";

  return `${titulo}\n\n${clienteLinha}\n\n${produtosTexto}${observacaoTexto}`;
};

const Form: React.FC = () => {
  const [tipo, setTipo] = useState("alterar");
  const [pedido, setPedido] = useState("");
  const [cliente, setCliente] = useState("");
  const [pdv, setPdv] = useState("");
  const [observacao, setObservacao] = useState("");
  const [produtos, setProdutos] = useState<Produto[]>([
    { codigo: "", pacotes: "", descricao: "", valor: "" },
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    setId(gerarId());
    setPedido("");
    setCliente("");
    setPdv("");
    setProdutos(
      tipo === "digitar" || tipo === "alterar"
        ? [{ codigo: "", pacotes: "", descricao: "", valor: "" }]
        : []
    );
  }, [tipo]);

  const handleProdutoChange = (
    index: number,
    field: keyof Produto,
    value: string
  ) => {
    const novosProdutos = [...produtos];
    novosProdutos[index] = { ...novosProdutos[index], [field]: value };
    setProdutos(novosProdutos);
  };

  const digitarProduto = () => {
    setProdutos([
      ...produtos,
      { codigo: "", pacotes: "", descricao: "", valor: "" },
    ]);
  };

  const removerProduto = (index: number) => {
    setProdutos(produtos.filter((_, i) => i !== index));
  };

  const isCodigoValido = (codigo: string) =>
    codigo.startsWith("90") && codigo.length === 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const codigosInvalidos = produtos.some((p) => !isCodigoValido(p.codigo));
    if (codigosInvalidos) return;

    const data = { tipo, pedido, cliente, pdv, produtos, observacao, id };
    console.log("Dados enviados:", data);

    try {
      await navigator.clipboard.writeText(formatarMensagem(data));
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }

    setOpenDialog(true);
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
        {/* Tipo */}
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
            <FormControlLabel
              value="alterar"
              control={<Radio />}
              label="🔀 Alterar"
            />
            <FormControlLabel
              value="digitar"
              control={<Radio />}
              label="🔠 Digitar"
            />
            <FormControlLabel
              value="cancelar"
              control={<Radio />}
              label="❌ Cancelar"
            />
          </RadioGroup>
        </FormControl>

        <Divider sx={{ my: 3 }} />

        {/* Pedido / Cliente */}
        <Typography variant="subtitle1" mb={1} fontWeight={600}>
          {tipo === "digitar" ? "Qual setor e PDV?" : "Qual o pedido?"}
        </Typography>
        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", sm: "2fr 3fr" }}
          gap={2}
          mb={2}
        >
          <TextField
            label={tipo === "digitar" ? "Setor" : "Nº Pedido"}
            required={tipo !== "cancelar"}
            value={pedido}
            onChange={(e) => {
              let valor = e.target.value.replace(/\D/g, "");
              if (tipo === "digitar") valor = valor.slice(0, 3);
              if (tipo === "alterar") valor = valor.slice(0, 4);
              setPedido(valor);
            }}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              maxLength: tipo === "digitar" ? 3 : tipo === "alterar" ? 4 : undefined,
            }}
            fullWidth
          />

          <TextField
            label={tipo === "digitar" ? "PDV" : "Razão"}
            required={tipo !== "cancelar"}
            value={tipo === "digitar" ? pdv : cliente}
            onChange={(e) => {
              if (tipo === "digitar") {
                let valor = e.target.value.replace(/\D/g, "").slice(0, 8);
                if (valor.length > 4)
                  valor = valor.slice(0, 4) + "-" + valor.slice(4);
                setPdv(valor);
              } else {
                setCliente(e.target.value);
              }
            }}
            inputProps={{
              inputMode: tipo === "digitar" ? "numeric" : undefined,
              pattern: tipo === "digitar" ? "\\d{4}-?\\d{0,4}" : undefined,
            }}
            fullWidth
          />
        </Box>

        {/* Produtos */}
        {(tipo === "digitar" || tipo === "alterar") && produtos.length > 0 && (
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
                  <TextField
                    label="Descrição"
                    required
                    value={produto.descricao}
                    onChange={(e) =>
                      handleProdutoChange(
                        index,
                        "descricao",
                        e.target.value.toUpperCase()
                      )
                    }
                    fullWidth
                    sx={{ mb: 2 }}
                  />

                  <Box
                    display="grid"
                    gridTemplateColumns={{ xs: "2fr 1.25fr 2fr" }}
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
                      label="PC"
                      required
                      value={produto.pacotes}
                      onChange={(e) =>
                        handleProdutoChange(
                          index,
                          "pacotes",
                          e.target.value.replace(/\D/g, "")
                        )
                      }
                      inputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                      }}
                      fullWidth
                    />

                    <TextField
                      label="R$"
                      value={produto.valor}
                      onChange={(e) =>
                        handleProdutoChange(
                          index,
                          "valor",
                          formatarValor(e.target.value)
                        )
                      }
                      inputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9,]*",
                      }}
                      fullWidth
                    />
                  </Box>

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
              onClick={digitarProduto}
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
          label="Ex. mudar pagamento, remover pedido"
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

      <Dialog
        open={openDialog}
        onClose={() => window.location.reload()}
        TransitionComponent={(props) => <Slide direction="up" {...props} />}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            textAlign: "center",
          },
        }}
        disableScrollLock
      >
        <DialogTitle>
          <CheckCircle color="success" sx={{ fontSize: 60 }} />
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Despacho Copiado!
          </Typography>
          <Typography color="text.secondary">
            Envie ou cole o despacho para seu supervisor. Deseja enviar agora para o Whatsapp dele?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => window.location.reload()}
          >
            DEPOIS
          </Button>
          <Button
            color="success"
            variant="contained"
            onClick={() => {
              const data = { tipo, pedido, cliente, pdv, produtos, observacao, id };
              const message = formatarMensagem(data);
              const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
                message
              )}`;
              window.open(whatsappUrl, "_blank");
              window.location.reload();
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
