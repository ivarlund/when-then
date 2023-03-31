import Head from 'next/head'
import { Inter } from 'next/font/google'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/reducers';
import { decrement, increment } from '@/slice';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const counter = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  const handleIncrement = () => {
    dispatch(increment());
  };

  const handleDecrement = () => {
    dispatch(decrement());
  };
  return (
    <>
      <Head>
        <title>When then</title>
        <meta name="description" content="The game, Well, when then?" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <h1>Counter: {counter}</h1>
        <button onClick={handleIncrement}>Increment</button>
        <button onClick={handleDecrement}>Decrement</button>
      </div>
    </>
  )
}
