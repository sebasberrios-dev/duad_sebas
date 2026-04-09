import { render, screen } from '@testing-library/react';
import { vi, expect, describe, beforeEach, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ContinueCard } from '../ContinueCard';

const renderContinueCard = (props = {}) =>
  render(
    <ContinueCard
      subtotal={props.subtotal ?? 25000}
      isLoading={props.isLoading ?? false}
      onContinue={props.onContinue ?? vi.fn()}
    />
  );

describe('ContinueCard', () => {
  let user;
  let mockOnContinue;

  beforeEach(() => {
    mockOnContinue = vi.fn();
    user = userEvent.setup();
  });

  it('renders total label and subtotal price', () => {
    renderContinueCard({ subtotal: 46000 });

    expect(screen.getByText('Total:')).toBeInTheDocument();
    expect(screen.getByText('₡46000')).toBeInTheDocument();
  });

  it('renders "Continuar al checkout" button', () => {
    renderContinueCard();

    expect(
      screen.getByRole('button', { name: /Continuar al checkout/i })
    ).toBeInTheDocument();
  });

  it('calls onContinue when clicking the button', async () => {
    renderContinueCard({ onContinue: mockOnContinue });

    await user.click(
      screen.getByRole('button', { name: /Continuar al checkout/i })
    );

    expect(mockOnContinue).toHaveBeenCalledTimes(1);
  });

  it('disables button when isLoading is true', () => {
    renderContinueCard({ isLoading: true, onContinue: mockOnContinue });

    expect(
      screen.getByRole('button', { name: /Continuando.../i })
    ).toBeDisabled();
  });
});
