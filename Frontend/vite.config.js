// // import { defineConfig } from 'vite'
// // import react from '@vitejs/plugin-react'

// // // https://vite.dev/config/
// // export default defineConfig({
// //   plugins: [react()],
// // })

// // vite.config.js
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,
//     proxy: {
//       // THIS IS THE MAGIC LINE THAT FIXES EVERYTHING
//       '/api': {
//         target: 'http://localhost:8000',
//         changeOrigin: true,
//         secure: false,
        
//       }
//     }
//   }
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // No proxy → No localhost anywhere
  server: {
    port: 5173,
    // proxy removed completely
  },

  // Make environment variables available properly
  define: {
    'process.env': {},
  },
})