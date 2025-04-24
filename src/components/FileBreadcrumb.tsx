
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

export type BreadcrumbItem = {
  id: string;
  name: string;
  path: string;
};

type FileBreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function FileBreadcrumb({ items }: FileBreadcrumbProps) {
  return (
    <nav className="flex px-5 py-3" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-sm text-gray-800 hover:text-sky-600"
          >
            <Home className="w-4 h-4 mr-2" />
            My Drive
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={item.id} className="flex items-center">
            <ChevronRight className="w-4 h-4 text-gray-500" />
            {index === items.length - 1 ? (
              <span className="ml-1 text-sm font-medium text-gray-800">
                {item.name}
              </span>
            ) : (
              <Link
                to={`/dashboard/${item.path}`}
                className="ml-1 text-sm text-gray-800 hover:text-sky-600"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
