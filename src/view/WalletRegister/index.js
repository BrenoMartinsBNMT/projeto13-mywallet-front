import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  DivContent,
  Transactions,
  UpBar,
  TransactionsHistory,
  InfosTransactions,
} from "./components/WalletRegister";
import { TailSpin } from "react-loader-spinner";
import { Link } from "react-router-dom";

export default function WalletRegister() {
  let localTokenLogin = localStorage.getItem("tokenLogin");
  let navigate = useNavigate();
  let [infosTransactions, setinfosTransactions] = useState();

  useEffect(() => {
    let promisse = axios.post(
      "https://my-wallet-breno-app.herokuapp.com/historico-de-transacoes",
      {
        token: localTokenLogin,
      }
    );

    promisse.then((element) => {
      setinfosTransactions(element.data);
    });
  }, []);

  function logout() {
    axios
      .post("https://my-wallet-breno-app.herokuapp.com/logout", {
        localTokenLogin,
      })
      .then(() => {
        navigate("/", { replace: true });
      })
      .catch(() => {
        alert("estamos com problemas técnicos!!");
      });
  }

  return (
    <DivContent>
      {!infosTransactions ? (
        <TailSpin />
      ) : (
        <>
          {" "}
          <UpBar>
            <p>Olá, {infosTransactions.name}</p>
            <span className="material-symbols-outlined" onClick={logout}>
              logout
            </span>
          </UpBar>
          <TransactionsHistory>
            <div>
              {infosTransactions.transactions.length === 0 ? (
                <div className="no-transactions">
                  <p>Não há registros de entrada ou saída</p>
                </div>
              ) : (
                infosTransactions.transactions.map((element, index) => {
                  return (
                    <InfosTransactions key={index}>
                      <div className="infos">
                        <p>{element.data}</p>
                        <span>{element.description}</span>
                      </div>
                      <p className={element.type}>
                        {element.balance.toString().includes(".")
                          ? element.balance.toString().replace(".", ",")
                          : `${element.balance.toString() + ",00"}`}
                      </p>
                    </InfosTransactions>
                  );
                })
              )}
            </div>
            <div className="balance">
              <span>Saldo:</span>
              {infosTransactions.balance >= 0 ? (
                <span className="add">
                  {infosTransactions.balance
                    .toFixed(2)
                    .toString()
                    .replace(".", ",")}
                </span>
              ) : (
                <span className="subs">
                  {infosTransactions.balance
                    .toFixed(2)
                    .toString()
                    .replace(".", ",")}
                </span>
              )}
            </div>
          </TransactionsHistory>
          <div className="buttons-trasactions">
            <Link to="/adicionar-saldo">
              <Transactions>
                <span className="material-symbols-outlined">add_circle</span>
                <p>Nova entrada</p>
              </Transactions>
            </Link>
            <Link to="/retirar-saldo">
              <Transactions>
                <span className="material-symbols-outlined">
                  do_not_disturb_on
                </span>
                <p>Nova saída</p>
              </Transactions>
            </Link>
          </div>
        </>
      )}
    </DivContent>
  );
}
