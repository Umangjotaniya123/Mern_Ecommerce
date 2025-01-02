import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'
import { UserProvider } from './contexts/AuthContexts.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <UserProvider>
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
  // </UserProvider>
)
