import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Users from "./scenes/users";
import Category from "./scenes/category";
import UserProfile from "./scenes/userProfile";
import CategoryProfile from "./scenes/cateProfile";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/users" element={<Users />} />
              <Route path="/category" element={<Category />} />
              <Route path="/userProfile/:id" element={<UserProfile />} />
              <Route path="/cateProfile" element={<CategoryProfile />} />
              <Route path="/cateProfile/:id" element={<CategoryProfile />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
