package api_gateway;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Value("${cognito.client-id}")
    private String clientId;

    @Value("${cognito.client-secret}")
    private String clientSecret;

    @Value("${cognito.token-uri}")
    private String tokenUri;

    @PostMapping("/token")
    public ResponseEntity<String> exchangeCode(@RequestBody CodeRequest request) {
        RestTemplate restTemplate = new RestTemplate();

        LinkedMultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", clientId);
        body.add("code", request.code());
        body.add("redirect_uri", "http://localhost:4200");

        String basicAuth = java.util.Base64.getEncoder()
                .encodeToString((clientId + ":" + clientSecret).getBytes());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("Authorization", "Basic " + basicAuth);

        HttpEntity<LinkedMultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);

        return restTemplate.postForEntity(tokenUri, entity, String.class);
    }

    public record CodeRequest(String code) {}
}