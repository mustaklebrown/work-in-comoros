import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, ArrowRight, CheckCircle2, Globe, Users, ShieldCheck, Zap, TrendingUp, Award, Star, ChevronRight, MapPin } from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Header */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-4 md:px-6 py-20 md:py-32 flex flex-col items-center text-center overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 -left-20 w-96 h-96 bg-[#0052cc]/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-5xl space-y-8 relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 text-[#0052cc] dark:text-blue-400 text-sm font-semibold border border-blue-100 dark:border-blue-900/50 shadow-sm">
              <Zap className="h-4 w-4" />
              <span>Plateforme RH de confiance aux Comores</span>
              <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] px-2">Nouveau</Badge>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
              Trouvez votre{" "}
              <span className="bg-gradient-to-r from-[#0052cc] via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                talent idéal
              </span>
              <br />
              aux Comores
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              La première plateforme de recrutement moderne qui connecte les entreprises comoriennes aux meilleurs talents locaux et de la diaspora.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#0052cc] to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white gap-2 h-16 px-12 text-lg shadow-2xl shadow-blue-500/30 ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all"
                asChild
              >
                <Link href="/register">
                  Commencer gratuitement <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-16 px-12 text-lg border-2 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                asChild
              >
                <Link href="/jobs?island=GRANDE_COMORE">
                  Explorer les offres
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-12 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>100% gratuit pour candidats</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>Conforme au Code du Travail</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>Support en français & shikomori</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-4 md:px-6 py-16 bg-white dark:bg-zinc-900/50 border-y border-zinc-200 dark:border-zinc-800">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#0052cc] to-blue-600 bg-clip-text text-transparent">500+</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Offres actives</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">2,000+</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Candidats inscrits</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">150+</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Entreprises</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">95%</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Taux de satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 md:px-6 py-24">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16 space-y-4">
              <Badge variant="outline" className="text-[#0052cc] border-blue-200 dark:border-blue-900">Fonctionnalités</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white">
                Tout ce dont vous avez besoin
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Une plateforme complète pensée pour le marché comorien
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature Card 1 */}
              <Card className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-900">
                <CardContent className="p-8 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                    <Globe className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Couverture Nationale</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    Recrutez sur les 3 îles (Grande Comore, Anjouan, Mohéli) et connectez-vous avec la diaspora mondiale.
                  </p>
                  <div className="flex items-center gap-2 text-[#0052cc] dark:text-blue-400 text-sm font-semibold pt-2">
                    En savoir plus <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>

              {/* Feature Card 2 */}
              <Card className="group hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 border-2 hover:border-emerald-200 dark:hover:border-emerald-900">
                <CardContent className="p-8 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">100% Conforme</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    Contrats, paie et déclarations automatisés selon le Code du Travail Comorien. Calcul CPCS intégré.
                  </p>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-semibold pt-2">
                    En savoir plus <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>

              {/* Feature Card 3 */}
              <Card className="group hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 border-2 hover:border-amber-200 dark:hover:border-amber-900">
                <CardContent className="p-8 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                    <Zap className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Ultra-Rapide</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    Optimisé pour 2G/3G/4G avec mode offline. Consultez les offres même sans connexion internet.
                  </p>
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm font-semibold pt-2">
                    En savoir plus <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>

              {/* Feature Card 4 */}
              <Card className="group hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 border-2 hover:border-purple-200 dark:hover:border-purple-900">
                <CardContent className="p-8 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Gestion Simplifiée</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    Tableau de bord intuitif pour gérer vos candidatures, entretiens et recrutements en un clic.
                  </p>
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-sm font-semibold pt-2">
                    En savoir plus <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>

              {/* Feature Card 5 */}
              <Card className="group hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-300 border-2 hover:border-pink-200 dark:hover:border-pink-900">
                <CardContent className="p-8 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Analytics Avancés</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    Suivez vos KPIs de recrutement avec des rapports détaillés et des insights en temps réel.
                  </p>
                  <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 text-sm font-semibold pt-2">
                    En savoir plus <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>

              {/* Feature Card 6 */}
              <Card className="group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 border-2 hover:border-indigo-200 dark:hover:border-indigo-900">
                <CardContent className="p-8 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                    <Award className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">CV Professionnels</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    Créez et téléchargez des CV professionnels en PDF avec des templates modernes et personnalisables.
                  </p>
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-semibold pt-2">
                    En savoir plus <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="px-4 md:px-6 py-24 bg-gradient-to-b from-white to-slate-50 dark:from-zinc-900/50 dark:to-zinc-950">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16 space-y-4">
              <Badge variant="outline" className="text-[#0052cc] border-blue-200 dark:border-blue-900">Témoignages</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white">
                Ils nous font confiance
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Découvrez ce que nos utilisateurs disent de nous
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 hover:shadow-xl transition-all">
                <CardContent className="p-8 space-y-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    "Work-in-Comoros a révolutionné notre processus de recrutement. Nous avons trouvé des talents exceptionnels en quelques jours."
                  </p>
                  <div className="flex items-center gap-3 pt-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                      AM
                    </div>
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-white">Ahmed Mohamed</div>
                      <div className="text-sm text-zinc-500">DRH, Comores Telecom</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-xl transition-all">
                <CardContent className="p-8 space-y-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    "Interface intuitive et support réactif. J'ai trouvé mon emploi de rêve en moins d'un mois. Merci W-I-C !"
                  </p>
                  <div className="flex items-center gap-3 pt-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                      FH
                    </div>
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-white">Fatouma Hassan</div>
                      <div className="text-sm text-zinc-500">Développeuse Web</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-xl transition-all">
                <CardContent className="p-8 space-y-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    "La conformité légale intégrée nous fait gagner un temps précieux. Un outil indispensable pour les RH."
                  </p>
                  <div className="flex items-center gap-3 pt-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      SA
                    </div>
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-white">Said Ali</div>
                      <div className="text-sm text-zinc-500">Directeur, Hôtel Al-Amal</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 md:px-6 py-24">
          <div className="container mx-auto max-w-5xl">
            <Card className="relative overflow-hidden border-0 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0052cc] via-blue-600 to-indigo-600" />
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-size-[200%_200%] animate-shimmer" />
              <CardContent className="relative z-10 p-12 md:p-20 text-center space-y-8">
                <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                  Prêt à transformer votre recrutement ?
                </h2>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                  Rejoignez les centaines d'entreprises qui font confiance à Work-in-Comoros pour trouver les meilleurs talents.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Button
                    size="lg"
                    className="bg-white text-[#0052cc] hover:bg-blue-50 h-16 px-12 text-lg font-bold shadow-xl"
                    asChild
                  >
                    <Link href="/register">
                      Créer mon compte gratuit
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-16 px-12 text-lg border-2 border-white/30 text-white hover:bg-white/10"
                    asChild
                  >
                    <Link href="/jobs">
                      Voir les offres
                    </Link>
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-blue-100 pt-4">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Aucune carte bancaire requise • Gratuit pour toujours</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 md:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand Column */}
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0052cc] to-blue-600 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div className="font-bold text-2xl text-zinc-900 dark:text-white">Work-in-Comoros</div>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-md leading-relaxed">
                La plateforme RH leader de l'archipel des Comores. Nous connectons les talents aux opportunités et simplifions la gestion des ressources humaines.
              </p>
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <MapPin className="h-4 w-4" />
                <span>Moroni, Union des Comores</span>
              </div>
            </div>

            {/* Product Column */}
            <div className="space-y-4">
              <div className="font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-white">Produit</div>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/jobs" className="text-zinc-600 dark:text-zinc-400 hover:text-[#0052cc] dark:hover:text-blue-400 transition-colors">
                    Offres d'emploi
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-zinc-600 dark:text-zinc-400 hover:text-[#0052cc] dark:hover:text-blue-400 transition-colors">
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="text-zinc-600 dark:text-zinc-400 hover:text-[#0052cc] dark:hover:text-blue-400 transition-colors">
                    Fonctionnalités
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="space-y-4">
              <div className="font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-white">Légal</div>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/terms" className="text-zinc-600 dark:text-zinc-400 hover:text-[#0052cc] dark:hover:text-blue-400 transition-colors">
                    Conditions d'utilisation
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-zinc-600 dark:text-zinc-400 hover:text-[#0052cc] dark:hover:text-blue-400 transition-colors">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-zinc-600 dark:text-zinc-400 hover:text-[#0052cc] dark:hover:text-blue-400 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-zinc-500">
              © 2024 Work-in-Comoros. Tous droits réservés.
            </div>
            <div className="flex items-center gap-6 text-sm text-zinc-500">
              <span>Made with ❤️ in Comoros</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
