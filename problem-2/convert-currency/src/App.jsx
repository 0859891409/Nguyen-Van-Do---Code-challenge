import { Suspense, useEffect, useMemo, useState } from "react";
import useDebounce from "./useDebounce";
import Select from "react-select";
function App() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputAmount, setInputAmount] = useState(0);
  const [baseCurrencyPrice, setBaseCurrencyPrice] = useState({
    name: "",
    price: 0,
  });
  const [targetCurrencyPrice, setTargetCurrencyPrice] = useState({
    name: "",
    price: 0,
  });
  const debouncedAmount = useDebounce(inputAmount, 500);

  const convertedValue = useMemo(() => {
    return (
      (baseCurrencyPrice.price / targetCurrencyPrice.price) * debouncedAmount ||
      0
    );
  }, [debouncedAmount, baseCurrencyPrice.price, targetCurrencyPrice.price]);

  useEffect(() => {
    fetch("https://interview.switcheo.com/prices.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPrices(data);
        setBaseCurrencyPrice(data?.at(0).price || 0);
        setTargetCurrencyPrice(data?.at(0).price || 0);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  const optionsBaseCurrency = () => {
    const options = prices.map((item) => {
      const images = import.meta.glob("./assets/tokens/*.svg", { eager: true });
      const icon = images[`./assets/tokens/${item.currency}.svg`]?.default;

      return {
        value: item.price,
        label: (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Suspense fallback={<span>Loading...</span>}>
              {icon && (
                <img
                  src={icon}
                  alt={item.currency}
                  width="20"
                  style={{ marginRight: 10 }}
                />
              )}
            </Suspense>

            {item.currency}
          </div>
        ),
        text: item.currency,
      };
    });

    return options;
  };

  return (
    <div className="container">
      <div className="converter-card">
        <h1 className="title">Currency Converter</h1>

        <div className="form-group">
          <label htmlFor="baseCurrency">Base Currency</label>
          <Select
            options={optionsBaseCurrency()}
            onChange={(e) =>
              setBaseCurrencyPrice({
                name: e.text,
                price: e.value,
              })
            }
            defaultValue={prices[0]}
          />
        </div>

        <div className="form-group">
          <label htmlFor="targetCurrency">Target Currency</label>
          <Select
            options={optionsBaseCurrency()}
            onChange={(e) => {
              console.log("e", e);
              setTargetCurrencyPrice({
                name: e.text,
                price: e.value,
              });
            }}
            defaultValue={prices[0]}
          />
        </div>

        <div className="form-group">
          <label htmlFor="inputAmount">Amount</label>
          <input
            id="inputAmount"
            type="number"
            min={0}
            placeholder="Enter amount"
            onChange={(e) => setInputAmount(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="convertedValue">Converted Amount</label>
          <input
            id="convertedValue"
            type="text"
            value={convertedValue.toLocaleString()}
            readOnly
            className="readonly-input"
          />
        </div>
        {inputAmount && baseCurrencyPrice.name && targetCurrencyPrice.name && (
          <label>{`Converted ${inputAmount} ${baseCurrencyPrice.name} = ${convertedValue} ${targetCurrencyPrice.name}`}</label>
        )}
      </div>
    </div>
  );
}

export default App;
