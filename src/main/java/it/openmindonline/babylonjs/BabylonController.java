package it.openmindonline.babylonjs;

import java.io.InputStream;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
public class BabylonController
{

    @RequestMapping(path = {"/", "/spaceship"})
    public String spaceship(Model model) {
        return "spaceship";
    }

    @RequestMapping(path = {"/bag", "/meshCustomizer"})
    public String bag(Model model) {
        return "meshCustomizer";
    }


    @RequestMapping(value = "/downloadtexture")
    public void downloadOrder(@RequestParam(value="name") String name, HttpServletResponse response)
    {

        try (InputStream in = getClass().getResourceAsStream("/static/babylon/mesh/"+name+"/"+name+".png"))
        {
            response.setHeader("Content-Disposition", "attachment; filename=" + name + ".png");
            response.setContentType("application/xml");
            //response.setContentLength(in.length);
            ServletOutputStream outputStream = response.getOutputStream();
            IOUtils.copy(in, outputStream);
            IOUtils.closeQuietly(outputStream);
            IOUtils.closeQuietly(in);
        }
        catch (Exception e)
        {
            //log.error("Error exporting order {}", orderNumber, e);
        }
    }




}
