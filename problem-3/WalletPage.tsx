interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = ({ children, ...rest }) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const priorityMap: Record<string, number> = {
    Osmosis: 100,
    Ethereum: 50,
    Arbitrum: 30,
    Zilliqa: 20,
    Neo: 20,
  };

  const getPriority = (blockchain: string) => priorityMap[blockchain] ?? -99;

  const sortedBalances = useMemo(() => {
    return balances
      .filter(({ blockchain, amount }) => getPriority(blockchain) > -99 && amount > 0)
      .sort((a, b) => getPriority(b.blockchain) - getPriority(a.blockchain));
  }, [balances]);

  const formattedBalances = sortedBalances.map((b) => ({
    ...b,
    formatted: b.amount.toFixed(2),
  }));

  return (
    <div {...rest}>
      {formattedBalances.map(({ currency, amount, formatted }) => (
        <WalletRow
          className={classes.row}
          key={currency}
          amount={amount}
          usdValue={prices[currency] * amount}
          formattedAmount={formatted}
        />
      ))}
    </div>
  );
};