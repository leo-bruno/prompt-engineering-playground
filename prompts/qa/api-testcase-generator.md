# API Test Case Generator

## Purpose
Generate full API test coverage from an endpoint description.

---

## Instructions
Given an API description (method, path, params, request body, response body, validation rules):

1. Generate a list of **test cases** covering:
   - Positive tests  
   - Negative tests  
   - Validation tests  
   - Boundary and edge cases  
   - Error codes and error messages  
   - Response structure validation  
   - Unauthorized or forbidden access (if applicable)

2. Present each test case using this structure:
   - **Test Name**
   - **Preconditions**
   - **Steps**
   - **Expected Result**

3. Organize tests into logical sections:
   - Positive  
   - Negative / error handling  
   - Validation  
   - Edge cases  
   - Security (optional)

---

## Input Example
GET /results?drawingId=123

Returns:
- 200 with result JSON  
- 404 if not found  
- 400 if missing drawingId

---

## Output Example
### Positive Tests
**TC01 – Valid drawingId returns result**  
Preconditions: A result exists for drawingId 123  
Steps:  
1. Send GET /results?drawingId=123  
Expected Result:  
- 200 OK  
- Response JSON matches expected schema  

### Negative Tests
**TC02 – Missing drawingId**  
Steps:  
1. Send GET /results  
Expected Result:  
- 400 Bad Request  

**TC03 – Unknown drawingId**  
Steps:  
1. Send GET /results?drawingId=99999  
Expected Result:  
- 404 Not Found  