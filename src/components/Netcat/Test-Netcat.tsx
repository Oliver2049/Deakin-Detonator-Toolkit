// Netcat.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Netcat from './Netcat'; // Adjust the import path as necessary

describe('Netcat Component', () => {
    it('submits the Website Port Scan form with correct values', () => {
        render(<Netcat />);
        
        // Simulate selecting the "Website Port Scan" option
        fireEvent.change(screen.getByLabelText(/Scan Option/i), { target: { value: 'Website Port Scan' } });
        
        // Fill out the form
        fireEvent.change(screen.getByLabelText(/Port number\/Port range/i), { target: { value: '80-443' } });
        fireEvent.change(screen.getByLabelText(/Domain name/i), { target: { value: 'example.com' } });
        
        // Submit the form
        fireEvent.click(screen.getByText(/start netcat/i));
        
        // Check if the form was submitted with correct values
        // This part depends on how your form submission is handled
        // You might need to mock the form submission and check the values
    });
});