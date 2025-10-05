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
} from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import styles from './Form.module.scss';

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
  const [produtos, setProdutos] = useState<Produto[]>([{ codigo: "", pacotes: "", descricao: "" }]);
  const [submitted, setSubmitted] = useState(false);

  // Limpar campos ao mudar tipo
  useEffect(() => {
    setPedido("");
    setCliente("");
    setPdv("");
    setProdutos(tipo === "incluir" || tipo === "alterar" ? [{ codigo: "", pacotes: "", descricao: "" }] : []);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const codigosInvalidos = produtos.some((p) => !isCodigoValido(p.codigo));
    if (codigosInvalidos) return;

    const data = { tipo, pedido, cliente, pdv, produtos, observacao };
    console.log("Dados enviados:", data);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: "auto", mt: 4, borderRadius: 3 }}>
      <Typography variant="h4" className={styles.titulo} mt={4}>
        <img src="/hnk-logo.png" alt="logo HNK" className={styles.logo} />
        Despachos
      </Typography>

      <Box component="form" onSubmit={handleSubmit} mt={3}>
        {/* Radio buttons */}
        <FormControl component="fieldset" fullWidth margin="normal" sx={{ textAlign: "center" }}>
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

        {/* Nº Pedido / Setor e Cliente / PDV */}
        <Typography variant="subtitle1" mb={1} fontWeight={600}>
          {tipo === "incluir" ? "Qual setor e PDV?" : "Qual o pedido?"}
        </Typography>
        <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "2fr 3fr" }} gap={2} mb={2}>
          <TextField
            label={tipo === "incluir" ? "Setor" : "Nº Pedido"}
            required={tipo !== "cancelar"}
            value={pedido}
            onChange={(e) => {
              let valor = e.target.value.replace(/\D/g, "");
              if (tipo === "incluir") valor = valor.slice(0, 3);
              setPedido(valor);
            }}
            inputProps={{ inputMode: "numeric", maxLength: tipo === "incluir" ? 3 : undefined }}
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
            fullWidth
          />
        </Box>

        {/* Produtos */}
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
                  <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "2fr 1fr" }} gap={2} mb={2}>
                    <TextField
                      label="Cód. Produto"
                      required
                      value={produto.codigo}
                      onChange={(e) => {
                        const valor = e.target.value.replace(/\D/g, "").slice(0, 6);
                        handleProdutoChange(index, "codigo", valor);
                      }}
                      inputProps={{ maxLength: 6 }}
                      fullWidth
                      error={submitted && !codigoValido}
                      helperText={
                        submitted && !codigoValido
                          ? "Código inválido: deve ter 6 dígitos e começar com 90"
                          : ""
                      }
                    />

                    <TextField
                      label="Quantidade"
                      required
                      value={produto.pacotes}
                      onChange={(e) =>
                        handleProdutoChange(index, "pacotes", e.target.value.replace(/\D/g, ""))
                      }
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
                      <IconButton color="error" onClick={() => removerProduto(index)} size="large">
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

        {/* Observação */}
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

        {/* Botão de envio */}
        <Divider sx={{ my: 3 }} />
        <Box textAlign="center" mt={2}>
          <Button type="submit" variant="contained" color="success">
            Enviar
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default Form;
