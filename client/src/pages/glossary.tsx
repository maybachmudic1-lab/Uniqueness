import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, BookText, ChevronDown } from "lucide-react";
import type { GlossaryTerm } from "@shared/schema";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function Glossary() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: terms, isLoading } = useQuery<GlossaryTerm[]>({
    queryKey: ["/api/glossary"],
  });

  const filteredTerms = terms?.filter((term) =>
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading glossary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookText className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Trading Glossary
          </h1>
          <p className="text-xl text-muted-foreground">
            Master the language of options trading with clear definitions
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 text-lg border-2 focus-visible:ring-primary"
            data-testid="input-search-glossary"
          />
        </div>

        {/* Results Count */}
        {searchTerm && (
          <p className="text-center text-muted-foreground">
            Found {filteredTerms?.length || 0} {filteredTerms?.length === 1 ? 'term' : 'terms'}
          </p>
        )}

        {/* Terms List */}
        <div className="space-y-3">
          {filteredTerms?.map((term) => (
            <Collapsible key={term.id}>
              <Card className="border-card-border hover-elevate transition-all">
                <CollapsibleTrigger className="w-full text-left" data-testid={`button-toggle-${term.term.toLowerCase().replace(/\s+/g, '-')}`}>
                  <CardHeader className="cursor-pointer">
                    <div className="flex items-center justify-between gap-4">
                      <CardTitle className="text-xl text-secondary" data-testid={`text-term-${term.term.toLowerCase().replace(/\s+/g, '-')}`}>
                        {term.term}
                      </CardTitle>
                      <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="bg-accent/50 rounded-lg p-4">
                      <p className="text-muted-foreground leading-relaxed" data-testid={`text-definition-${term.term.toLowerCase().replace(/\s+/g, '-')}`}>
                        {term.definition}
                      </p>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>

        {filteredTerms?.length === 0 && (
          <Card className="border-card-border">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No terms found matching "{searchTerm}"
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
