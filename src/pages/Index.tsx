import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { ShoppingBag, Sparkles, Heart, TrendingUp, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-background py-20 px-4 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card/50 px-4 py-2 text-sm backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Premium Quality Sweets</span>
            </div>
            
            <h1 className="font-heading text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Sweet Success
              </span>
              <br />
              <span className="text-foreground">Suite</span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Discover our handcrafted collection of premium sweets. Fresh, delicious, and made with love.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/dashboard">
                <Button size="lg" className="group text-lg px-8 py-6 h-auto shadow-warm">
                  Browse All Sweets
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto">
                  Sign In / Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-accent/5 blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 px-4 bg-card/30">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="group rounded-2xl border bg-card p-8 shadow-card transition-all hover:shadow-warm hover:-translate-y-1">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShoppingBag className="h-7 w-7" />
              </div>
              <h3 className="mb-2 font-heading text-xl font-semibold">Wide Selection</h3>
              <p className="text-muted-foreground">
                Browse through hundreds of premium sweets from various categories
              </p>
            </div>
            
            <div className="group rounded-2xl border bg-card p-8 shadow-card transition-all hover:shadow-warm hover:-translate-y-1">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Heart className="h-7 w-7" />
              </div>
              <h3 className="mb-2 font-heading text-xl font-semibold">Made with Love</h3>
              <p className="text-muted-foreground">
                Every sweet is crafted with care using the finest ingredients
              </p>
            </div>
            
            <div className="group rounded-2xl border bg-card p-8 shadow-card transition-all hover:shadow-warm hover:-translate-y-1">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-success/10 text-success">
                <TrendingUp className="h-7 w-7" />
              </div>
              <h3 className="mb-2 font-heading text-xl font-semibold">Fresh Daily</h3>
              <p className="text-muted-foreground">
                Our inventory is updated daily to ensure the freshest products
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border bg-gradient-to-br from-primary/10 via-accent/5 to-background p-12 text-center shadow-warm">
            <h2 className="mb-4 font-heading text-3xl font-bold sm:text-4xl">
              Ready to Indulge?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of satisfied customers and start your sweet journey today
            </p>
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 py-6 h-auto">
                Create Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
