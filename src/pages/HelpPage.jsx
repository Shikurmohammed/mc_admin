import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  ExpandMore,
  Help,
  QuestionAnswer,
  School,
  Email,
  Phone,
  Chat,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      category: 'Account',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click on the "Register" button on the login page and fill in your details. You can register as a customer or artisan.',
        },
        {
          q: 'How do I reset my password?',
          a: 'Click on "Forgot Password" on the login page and follow the instructions sent to your email.',
        },
        {
          q: 'How do I update my profile information?',
          a: 'Go to Settings > Profile Settings to update your personal information, avatar, and contact details.',
        },
      ],
    },
    {
      category: 'Crafts & Orders',
      questions: [
        {
          q: 'How do I place an order?',
          a: 'Browse crafts, click "Add to Cart" on your desired item, then proceed to checkout to complete your order.',
        },
        {
          q: 'How do I track my order?',
          a: 'Go to Orders > My Orders to see the status and tracking information for all your orders.',
        },
        {
          q: 'Can I cancel an order?',
          a: 'Orders can be cancelled within 1 hour of placing them, provided they haven\'t been processed yet.',
        },
      ],
    },
    {
      category: 'For Artisans',
      questions: [
        {
          q: 'How do I list a new craft?',
          a: 'Go to My Crafts > Add New Craft and fill in the details, upload images, and set your price.',
        },
        {
          q: 'How do I manage orders?',
          a: 'Go to Orders to view and manage all incoming orders. You can update order status and add tracking numbers.',
        },
        {
          q: 'How do I get paid?',
          a: 'Payouts are processed every Friday for orders completed in the previous week.',
        },
      ],
    },
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

  const supportOptions = [
    {
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      icon: <Email sx={{ fontSize: 40 }} />,
      action: 'support@craftsmarketplace.com',
      button: 'Send Email',
    },
    {
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      icon: <Chat sx={{ fontSize: 40 }} />,
      action: 'Available 9am-5pm EST',
      button: 'Start Chat',
    },
    {
      title: 'Phone Support',
      description: 'Speak directly with a support agent',
      icon: <Phone sx={{ fontSize: 40 }} />,
      action: '+2519...',
      button: 'Call Now',
    },
    {
      title: 'Knowledge Base',
      description: 'Browse detailed guides and tutorials',
      icon: <School sx={{ fontSize: 40 }} />,
      action: 'Self-service resources',
      button: 'Browse Guides',
    },
  ];

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Help & Support"
        subtitle="Find answers to common questions and get support"
        breadcrumbs={true}
      />

      {/* Search */}
      <Paper sx={{ p: 4, mb: 4, textAlign: 'center' }}>
        <Help sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          How can we help you?
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Search our help center or browse FAQs below
        </Typography>
        <TextField
          fullWidth
          placeholder="Search for help..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ maxWidth: 600, mx: 'auto' }}
        />
      </Paper>

      {/* FAQs */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Frequently Asked Questions
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {filteredFaqs.map((category, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {category.category}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {category.questions.map((faq, idx) => (
                <Accordion key={idx} elevation={0} sx={{ '&:before': { display: 'none' } }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="body2" fontWeight={500}>
                      {faq.q}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">
                      {faq.a}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Support Options */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Contact Support
      </Typography>
      <Grid container spacing={3}>
        {supportOptions.map((option, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {option.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {option.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {option.description}
                </Typography>
                <Typography variant="caption" display="block" sx={{ mb: 2 }}>
                  {option.action}
                </Typography>
                <Button variant="outlined" size="small">
                  {option.button}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Status */}
      <Paper sx={{ mt: 4, p: 3, textAlign: 'center', bgcolor: 'success.light', color: 'success.contrastText' }}>
        <Typography variant="body1">
          All systems operational ✓
        </Typography>
      </Paper>
    </Container>
  );
};

export default HelpPage;