import Navbar from './components/layout/Navbar'; // 1. Import your Navbar
import { AppRoutes } from './routes/AppRoutes';

function App() {
    return (
        <div className="App">
            <Navbar /> {/* 2. Add it here, above your routes */}
            <main className="main-content"> {/* Optional: good for styling */}
                <AppRoutes /> {/* 3. Your pages will render here */}
            </main>
        </div>
    );
}

export default App;