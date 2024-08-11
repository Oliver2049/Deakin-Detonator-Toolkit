// Dmitry.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Dmitry from './Dmitry'; // Adjust the import path as necessary

describe('Dmitry Component', () => {
    it('renders the form inputs correctly', () => {
        render(<Dmitry />);
        
        // Check if all form inputs are rendered
        expect(screen.getByLabelText(/Read in the Banner received from the scanned port/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Delay \(in seconds\)/i)).toBeInTheDocument();
    });

    it('handles checkbox changes correctly', () => {
        render(<Dmitry />);
        
        // Check initial state of the checkbox
        const bannerCheckbox = screen.getByLabelText(/Read in the Banner received from the scanned port/i);
        expect(bannerCheckbox).not.toBeChecked();
        
        // Change the checkbox state
        fireEvent.click(bannerCheckbox);
        expect(bannerCheckbox).toBeChecked();
    });

    it('handles text input changes correctly', () => {
        render(<Dmitry />);
        
        // Check initial state of the text input
        const delayInput = screen.getByLabelText(/Delay \(in seconds\)/i);
        expect(delayInput).toHaveValue(null);
        
        // Change the text input value
        fireEvent.change(delayInput, { target: { value: '5' } });
        expect(delayInput).toHaveValue(5);
    });

    it('submits the form with correct values', () => {
        render(<Dmitry />);
        
        // Fill out the form
        fireEvent.click(screen.getByLabelText(/Read in the Banner received from the scanned port/i));
        fireEvent.change(screen.getByLabelText(/Delay \(in seconds\)/i), { target: { value: '5' } });
        
        // Submit the form
        fireEvent.click(screen.getByText(/Start Scanning/i));
        
        // Check if the form was submitted with correct values
        // This part depends on how your form submission is handled
        // You might need to mock the form submission and check the values
    });
});