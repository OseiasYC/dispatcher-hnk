import { useState, useEffect } from "react";
import Form from "./components/Form/Form";
import Closed from "./components/Closed/ClosedPage";

export function App() {
  const [horaAtual, setHoraAtual] = useState(new Date().getHours());

  useEffect(() => {
    const intervalo = setInterval(() => {
      setHoraAtual(new Date().getHours());
    }, 1000 * 60);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div>
      {horaAtual >= 17 ? <Closed /> : <Form />}
    </div>
  );
}

export default App;