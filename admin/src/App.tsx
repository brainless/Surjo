import { Router, Route } from "@solidjs/router"
import { lazy } from "solid-js"
import { AuthProvider } from "./contexts/AuthContext"
import { ProtectedRoute } from "./components"

const Dashboard = lazy(() => import("./pages/Home"))
const Users = lazy(() => import("./pages/About"))

function App() {
  return (
    <AuthProvider>
      <Router>
        <Route path="/" component={() => (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )} />
        <Route path="/users" component={() => (
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        )} />
      </Router>
    </AuthProvider>
  )
}

export default App
