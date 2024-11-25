"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface SearchResult {
  id: string
  name: string
  type: string
  lastModified: string
  relevance: number
}

const mockSearch = (query: string, type: string): SearchResult[] => {
  // This is a mock function. In a real application, this would be an API call.
  return [
    { id: "1", name: "Financial Report Q2.pdf", type: "PDF", lastModified: "2023-07-15", relevance: 0.95 },
    { id: "2", name: "Marketing Strategy.docx", type: "Word", lastModified: "2023-07-20", relevance: 0.85 },
    { id: "3", name: "Product Roadmap.pptx", type: "PowerPoint", lastModified: "2023-07-18", relevance: 0.75 },
  ]
}

export function AdvancedSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("all")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])

  const handleSearch = () => {
    const results = mockSearch(searchQuery, searchType)
    setSearchResults(results)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Search</CardTitle>
        <CardDescription>Search across all your documents with advanced filters</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Enter search query..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select value={searchType} onValueChange={setSearchType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="word">Word</SelectItem>
              <SelectItem value="powerpoint">PowerPoint</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSearch}>Search</Button>
        </div>
        {searchResults.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>Relevance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchResults.map((result) => (
                <TableRow key={result.id}>
                  <TableCell>{result.name}</TableCell>
                  <TableCell>{result.type}</TableCell>
                  <TableCell>{result.lastModified}</TableCell>
                  <TableCell>{result.relevance.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline">Save Search</Button>
      </CardFooter>
    </Card>
  )
}

