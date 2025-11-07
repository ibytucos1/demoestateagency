# Leads Module - Quick Start Guide

## 🚀 Getting Started

### 1. Run Database Migration
```bash
npx prisma migrate deploy
# or for development
npx prisma migrate dev
```

### 2. Access the Leads Dashboard
Navigate to: `/admin/leads`

## ✨ Key Features

### Lead Status Management
Leads can have 5 statuses:
- 🔵 **New** - Fresh leads awaiting response
- 🟡 **Contacted** - Initial contact made
- 🟣 **Qualified** - Qualified opportunity
- 🟢 **Converted** - Successful conversion
- ⚫ **Archived** - Closed/archived leads

### How to Manage Leads

1. **View All Leads**: Go to `/admin/leads`
2. **Search Leads**: Use the search bar (searches name, email, phone, message)
3. **Filter Leads**: 
   - Filter by status (New, Contacted, etc.)
   - Filter by source (Form, Contact, Valuation, etc.)
4. **View Details**: Click any lead card to open the detail dialog
5. **Update Lead**:
   - Change status using dropdown
   - Assign to an agent
   - Add internal notes
   - Save changes
6. **Delete Lead**: Click "Delete Lead" in the detail dialog (Owner/Admin only)

### Lead Sources

Leads automatically come from:
- **form** - Property listing enquiry forms
- **contact** - Contact page form
- **valuation** - Valuation request form
- **phone** - Manual phone enquiries (future)
- **portal** - Third-party portals (future)

## 📊 Metrics Dashboard

The dashboard shows:
- Total leads (all time)
- Leads in last 7/30 days
- Lead status breakdown
- Lead sources breakdown
- WhatsApp engagement metrics

## 🔍 Search & Filter

### Search
Type in the search box to find leads by:
- Name
- Email address
- Phone number
- Message content

### Filters
- **Status Filter**: Show only leads with specific status
- **Source Filter**: Show only leads from specific source
- **Clear Filters**: Reset all filters at once

## 👥 Team Features

### Assignment
- Assign leads to agents/admins from the lead detail dialog
- Track who is handling each lead
- Filter by assigned user (coming soon)

### Notes
- Add internal notes to leads
- Track conversation history
- Document important information

## 📥 Export

Click "Export CSV" button to download all leads as a CSV file with:
- Name, Email, Phone
- Associated Property
- Message
- Source
- Date received

## 🔗 Integration Points

### Contact Form
- Location: `/contact`
- Automatically creates leads with source 'contact'
- Includes Turnstile spam protection

### Valuation Form
- Location: `/valuation`
- Automatically creates leads with source 'valuation'
- Includes property address in message

### Property Enquiry Form
- Location: Each property listing page
- Automatically creates leads with source 'form'
- Links to specific property

## 🎯 Best Practices

1. **Respond Quickly**: Check "New" leads daily
2. **Update Status**: Move leads through the pipeline (New → Contacted → Qualified → Converted)
3. **Add Notes**: Document important information for your team
4. **Assign Leads**: Distribute leads to appropriate team members
5. **Archive Old Leads**: Keep your dashboard clean by archiving old/dead leads

## 🔒 Permissions

- **Owner/Admin/Agent**: Can view and update leads
- **Owner/Admin**: Can delete leads
- **Assignment**: Can assign to any owner/admin/agent in the tenant

## 📱 Mobile Friendly

All lead management features are fully responsive and work on mobile devices.

## 🆘 Troubleshooting

### Leads not showing up?
- Check that forms are submitting successfully (check browser console)
- Verify Turnstile is configured if using spam protection
- Check that tenant ID is correct

### Can't update lead?
- Verify you're logged in as owner/admin/agent
- Check browser console for errors
- Ensure lead belongs to your tenant

### Export not working?
- Check that you're logged in
- Verify you have owner/admin/agent role
- Check browser console for errors

## 🔮 Coming Soon

- Email templates for lead responses
- Lead activity timeline
- Bulk actions
- Advanced filtering (date range, assigned user)
- Automated assignment rules
- Email notifications
- Lead scoring
- Response time tracking
- Conversion analytics

---

**Need Help?** Check `/docs/LEADS_MODULE_COMPLETED.md` for full technical documentation.

