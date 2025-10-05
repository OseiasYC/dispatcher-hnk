import React, { useState } from "react";
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

const Form: React.FC = () => {
  const [tipo, setTipo] = useState("adicionar");
  const [pedido, setPedido] = useState("");
  const [cliente, setCliente] = useState("");
  const [observacao, setObservacao] = useState("");
  const [produtos, setProdutos] = useState([{ codigo: "", pacotes: "", descricao: "" }]);

  const handleProdutoChange = (index: number, field: string, value: string) => {
    const novosProdutos = [...produtos];
    novosProdutos[index] = { ...novosProdutos[index], [field]: value };
    setProdutos(novosProdutos);
  };

  const adicionarProduto = () => {
    setProdutos([...produtos, { codigo: "", pacotes: "", descricao: "" }]);
  };

  const removerProduto = (index: number) => {
    const novos = produtos.filter((_, i) => i !== index);
    setProdutos(novos);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { tipo, pedido, cliente, produtos, observacao };
    console.log("Dados enviados:", data);
    alert("Dados enviados! Veja o console.");
  };

  return (
    <Paper
      elevation={3}
      sx={{ p: 3, maxWidth: 800, mx: "auto", mt: 4, borderRadius: 3 }}
    >
      <Typography
        variant="h4"
        className={styles.titulo}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <img
          src="public/red-star.svg"
          alt="estrela Heineken"
          className={styles.estrela}
        />
        <h3>Despacho</h3>
        <img
          src="public/hnk-logo.png"
          alt="logo HNK"
          className={styles.logo}
        />
      </Typography>

      <Box component="form" onSubmit={handleSubmit} mt={3}>
        {/* Radio buttons */}
        <FormControl component="fieldset" fullWidth margin="normal" sx={{ textAlign: "center" }}>
          <RadioGroup
            row
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            sx={{ justifyContent: "center" }}
          >
            <FormControlLabel value="alterar" control={<Radio />} label="🔀 Alterar" />
            <FormControlLabel value="adicionar" control={<Radio />} label="⏫ Adicionar" />
            <FormControlLabel value="excluir" control={<Radio />} label="❌ Excluir" />
          </RadioGroup>
        </FormControl>

        <Divider sx={{ my: 3 }} />

        {/* Nº Pedido e Cliente */}
        <Typography variant="subtitle1" mb={1} fontWeight={600}>
          Qual o pedido?
        </Typography>
        <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "2fr 3fr" }} gap={2} mb={2}>
          <TextField
            label="Nº Pedido"
            required
            value={pedido}
            onChange={(e) => setPedido(e.target.value.replace(/\D/g, ""))}
            inputProps={{ inputMode: "numeric" }}
            fullWidth
          />
          <TextField
            label="Cliente"
            required
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            fullWidth
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Produtos */}
        <Box>
          <Typography variant="subtitle1" mb={1} fontWeight={600}>
            Quais produtos?
          </Typography>

          {produtos.map((produto, index) => (
            <Box
              key={index}
              mb={2}
              sx={{
                border: "1px solid #ddd",
                p: 2,
                borderRadius: 1,
              }}
            >
              {/* Grid para Código e Quantidade */}
              <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "2fr 1fr" }} gap={2} mb={2}>
                <TextField
                  label="Cód. Produto"
                  value={produto.codigo}
                  onChange={(e) =>
                    handleProdutoChange(index, "codigo", e.target.value.replace(/\D/g, ""))
                  }
                  inputProps={{ maxLength: 6 }}
                  fullWidth
                />

                <TextField
                  label="Quantidade"
                  value={produto.pacotes}
                  onChange={(e) =>
                    handleProdutoChange(index, "pacotes", e.target.value.replace(/\D/g, ""))
                  }
                  fullWidth
                />
              </Box>

              {/* Descrição */}
              <TextField
                label="Descrição"
                value={produto.descricao}
                onChange={(e) => handleProdutoChange(index, "descricao", e.target.value)}
                fullWidth
                margin="normal"
              />

              {/* Botão de remover */}
              {produtos.length > 1 && (
                <Box textAlign="right" mt={1}>
                  <IconButton color="error" onClick={() => removerProduto(index)} size="large">
                    <RemoveCircle />
                  </IconButton>
                </Box>
              )}
            </Box>
          ))}

          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddCircle />}
            onClick={adicionarProduto}
            sx={{ mt: 1 }}
          >
            Incluir outro produto
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Observação */}
        <Typography variant="subtitle1" mb={1} fontWeight={600}>
          Alguma observação?
        </Typography>
        <TextField
          label="Ex. mudar para cartão de crédito"
          fullWidth
          multiline
          rows={3}
          margin="normal"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
        />

        <Divider sx={{ my: 3 }} />

        {/* Botão de envio */}
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
