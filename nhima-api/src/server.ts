import app  from './app'

const PORT = process.env.PORT || 9901

app.listen(PORT, () => {
  console.log('')
  console.log('╔═══════════════════════════════════════════════╗')
  console.log('║        NHIMA API — TypeScript + Drizzle       ║')
  console.log('╠═══════════════════════════════════════════════╣')
  console.log(`║  Port    : ${PORT}                               ║`)
  console.log(`║  Env     : ${process.env.NODE_ENV ?? 'development'}                    ║`)
  console.log(`║  Health  : http://localhost:${PORT}/health       ║`)
  console.log(`║  Auth    : http://localhost:${PORT}/api/auth     ║`)
  console.log('╚═══════════════════════════════════════════════╝')
  console.log('')
})
