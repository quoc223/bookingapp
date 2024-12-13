import React from 'react';
import { Card, CardBody, Typography, Button } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="max-w-lg mx-auto">
                <CardBody className="text-center">
                    <Typography variant="h1" color="red" className="mb-4">
                        404
                    </Typography>
                    <Typography variant="h5" color="blue-gray" className="mb-2">
                        Page Not Found
                    </Typography>
                    <Typography color="blue-gray" className="mb-6">
                        The page you are looking for does not exist or has been moved.
                    </Typography>
                    <Button color="blue" onClick={handleGoHome}>
                        Go to Home
                    </Button>
                </CardBody>
            </Card>
        </div>
    );
};

export default NotFoundPage;
