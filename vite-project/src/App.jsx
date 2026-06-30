import React, {useContext} from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Customize } from './pages/Customize';
import { CartModal } from './components/CartModal';

function AppContent(){
    const {currentView} = useContext(AppContext);

    return(
        <div className="app-container">
            <Header />

            <main className="main-content">
                {currentView === 'home' && <Home/>}
                {currentView === 'customize' && <Customize/>}
            </main>

            <CartModal/>
        </div>
    );
}

function App(){
    return(
        <AppProvider>
            <AppContent/>
        </AppProvider>
    );
}

export default App;