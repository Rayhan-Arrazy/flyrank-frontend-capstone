import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommodityCard from "../CommodityCard";

// Mock the store
vi.mock("../../store/valuoStore", () => ({
  useValuoStore: () => ({
    watchlist: [],
    addToWatchlist: vi.fn(),
    removeFromWatchlist: vi.fn(),
  }),
}));

const mockCommodity = {
  id: "gold",
  name: "Gold",
  symbol: "XAU",
  price: 2400,
  change24h: 12.5,
  changePercent24h: 0.52,
  unit: "oz",
  lastUpdated: new Date(),
};

describe("CommodityCard", () => {
  it("renders commodity name and price", () => {
    render(<CommodityCard commodity={mockCommodity} />);
    expect(screen.getByText("Gold")).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes("2,400.00"))).toBeInTheDocument();
  });

  it("shows positive change in green", () => {
    render(<CommodityCard commodity={mockCommodity} />);
    const changeElement = screen.getByText(/12\.50/);
    expect(changeElement).toHaveClass("text-emerald-500");
  });
});

export default CommodityCard;
