export function Footer() {
  return (
    <footer className="py-8 mt-auto bg-muted/50 border-t border-border/40">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} ScholarQuiz. All rights reserved. Powered by AI.</p>
      </div>
    </footer>
  );
}
