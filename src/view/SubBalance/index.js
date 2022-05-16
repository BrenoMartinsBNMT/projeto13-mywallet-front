import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  DivSubBalance,
  Title,
  FormSubBalance,
} from "./components/ComponentsSubBalance";

export default function SubBalance() {
  let regexMoney = /^[0-9]{1,5},[0-9]{0,2}$/;
  let navigate = useNavigate();
  let [value, setValue] = useState();
  let [description, setDescription] = useState();
  let token = localStorage.getItem("tokenLogin");
  return (
    <DivSubBalance>
      <Title>
        <p>Nova Saída</p>
      </Title>
      <FormSubBalance
        onSubmit={(element) => {
          element.preventDefault();
          if (regexMoney.test(element.target[0].value)) {
            if (!value || !description) {
              alert("preencha os campos corretamente");
            } else {
              axios
                .post(
                  "https://my-wallet-breno-app.herokuapp.com/historico-de-transacoes/retirar-saldo",
                  {
                    balance: parseFloat(value.replace(",", ".")),
                    token,
                    description,
                  }
                )
                .then(() => {
                  alert("Saída concluída com sucesso!");
                  setTimeout(() => {
                    navigate("/carteira", { replace: true });
                  }, 1000);
                })
                .catch(() => {
                  alert("houve algum erro ao completar a transação :(");
                });
            }
          } else {
            alert("Por Favor insira um valor no formato 12345,67");
          }
        }}
      >
        <input
          type="text"
          placeholder="Valor"
          onChange={(element) => {
            setValue(element.target.value);
          }}
        />
        <input
          type="text"
          placeholder="descrição"
          onChange={(element) => {
            setDescription(element.target.value);
          }}
        />
        <button type="submit">Salvar Saída</button>
      </FormSubBalance>
    </DivSubBalance>
  );
}
