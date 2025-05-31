// Import pre-generated JSON files
import categories from '@/assets/config/categories.json';
import paperTypes from '@/assets/config/paper_types.json';
import papers from '@/assets/config/papers.json';
import years from '@/assets/config/years.json';

// Types are defined in the interfaces below

// Interface for paper information
export interface PaperInfo {
  id: string;
  year: string;
  type: string;
  categoryId: string;
  title: string;
  originalFileName: string;
  fileName: string;
  path: string;
  requirePath: any; // This will hold the actual required module, not a string
}

// Interface for category information
export interface CategoryInfo {
  id: string;
  name: string;
  folder: string;
}
// Get list of available years
export const getYears = async (): Promise<string[]> => {
  return years as string[];
};

// Get paper types for a specific year
export const getPaperTypes = (year?: string): { id: string; name: string }[] => {
  if (!year) {
    return [
      { id: "prelims", name: "Preliminary Examination" },
      { id: "mains", name: "Main Examination" }
    ];
  }
  
  // Use type assertion to help TypeScript understand the indexing
  const typesForYear = paperTypes[year as keyof typeof paperTypes] || [];
  
  return typesForYear.map((type: string) => ({
    id: type,
    name: type === 'prelims' ? 'Preliminary Examination' : 'Main Examination'
  }));
};

// Get available paper categories based on exam type and year
export const getPaperCategories = (type: string, year?: string): { id: string; name: string }[] => {
  if (!year) {
    return [];
  }
  
  const key = `${year}/${type.toLowerCase()}`;
  const catsForYearType = categories[key as keyof typeof categories] || [];
  
  return catsForYearType.map((cat: CategoryInfo) => ({
    id: cat.id,
    name: cat.name
  }));
};

// Get papers for a specific year, type, and category
export const getPapers = (year: string, type: string, category: string): PaperInfo[] => {
  const typedPapers = papers as unknown as PaperInfo[];
  
  const matchingPapers = typedPapers.filter(paper => 
    paper.year === year && 
    paper.type.toLowerCase() === type.toLowerCase() && 
    paper.categoryId === category
  );
  
    return matchingPapers;
};

