const NotFound = () => (
  <main className="grid min-h-screen place-items-center px-6">
    <div className="max-w-md">
      <h1 className="font-display text-[clamp(4rem,12vw,7rem)] font-bold uppercase leading-none">404</h1>
      <p className="mt-4 text-[1.0625rem] text-muted-foreground">There is nothing at this address.</p>
      <a href="/" className="mt-6 inline-block text-primary underline underline-offset-4">
        Back to the start
      </a>
    </div>
  </main>
);

export default NotFound;
