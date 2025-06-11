export function Footer() {
  return (
    <footer className="py-6 mt-auto bg-card border-t">
      <div className="container mx-auto text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} ScholarQuiz. All rights reserved.</p>
      </div>
    </footer>
  );
}
