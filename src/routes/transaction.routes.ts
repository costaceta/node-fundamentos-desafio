import { Router } from 'express';
import { uuid } from 'uuidv4';

// import TransactionsRepository from '../repositories/TransactionsRepository';
// import CreateTransactionService from '../services/CreateTransactionService';

const transactionRouter = Router();

interface Transaction {
  id: string;
  title: string;
  value: number;
  type: string;
}

const transactions: Transaction[] = [];

// const transactionsRepository = new TransactionsRepository();

transactionRouter.get('/', (request, response) => {
  try {
    const countIncome = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((total, transaction) => (total += transaction.value), 0);

    const countOutcome = transactions.reduce((total, trasaction) => {
      if (trasaction.type === 'outcome') {
        return (total += trasaction.value);
      } else {
        return total;
      }
    }, 0);

    const balanceTotal = countIncome - countOutcome;

    const transactionsList = {
      transactions,
      balance: {
        income: countIncome,
        outcome: countOutcome,
        total: balanceTotal,
      },
    };

    return response.json(transactionsList);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', (request, response) => {
  try {
    const { title, value, type } = request.body;

    const transaction = {
      id: uuid(),
      title,
      value,
      type,
    };

    transactions.push(transaction);

    return response.json(transaction);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
