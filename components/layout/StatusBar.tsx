export function StatusBar() {
  return (
    <footer className="flex h-7 shrink-0 items-center justify-between border-t border-outline-variant bg-surface-container-lowest px-3 text-data-mono text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-clinical-success" />
        <span>Cloud Sync: Active</span>
      </div>
      <span>WS-04 // Latency: 24ms</span>
      <span>Planning Suite v4.2.0-stable</span>
    </footer>
  )
}
